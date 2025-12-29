-- ==========================================
-- 3. FUNCTIONS & TRIGGERS
-- Logic for Auditing, Integrity, and Performance
-- Note: Triggers aren't used for any business logic
-- since java spring application will handle it
-- ==========================================

-- ------------------------------------------
-- A. AUDITING
-- ------------------------------------------

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function: log_book_changes
CREATE OR REPLACE FUNCTION log_book_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.price <> NEW.price OR OLD.available_copies <> NEW.available_copies) THEN
            INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
            VALUES (
                'books',
                OLD.id,
                'UPDATE',
                row_to_json(OLD)::jsonb,
                row_to_json(NEW)::jsonb,
                current_user
            );
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_data, changed_by)
        VALUES (
            'books',
            OLD.id,
            'DELETE',
            row_to_json(OLD)::jsonb,
            current_user
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function: log_loan_changes
CREATE OR REPLACE FUNCTION log_loan_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        -- Log status changes (e.g. ACTIVE -> RETURNED, ACTIVE -> CANCELLED)
        IF (OLD.status <> NEW.status) THEN
            INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
            VALUES (
                'loans',
                OLD.id,
                'STATUS_CHANGE',
                jsonb_build_object('status', OLD.status),
                jsonb_build_object('status', NEW.status),
                current_user
            );
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_data, changed_by)
        VALUES (
            'loans',
            OLD.id,
            'DELETE',
            row_to_json(OLD)::jsonb,
            current_user
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- ------------------------------------------
-- B. DATA INTEGRITY
-- ------------------------------------------

-- Function: check_book_stock
CREATE OR REPLACE FUNCTION check_book_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.available_copies < 0 THEN
        RAISE EXCEPTION 'Data Integrity Violation: Available copies cannot be negative (Book ID: %)', NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: prevent_loan_modification
-- Ensures user_id and copy_id are immutable on loans
CREATE OR REPLACE FUNCTION prevent_loan_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.user_id <> NEW.user_id) OR (OLD.copy_id <> NEW.copy_id) THEN
        RAISE EXCEPTION 'Data Integrity Violation: Cannot change User or Copy for an existing Loan (Loan ID: %).', OLD.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: check_copy_availability
-- Prevents loaning a copy that isn't AVAILABLE
CREATE OR REPLACE FUNCTION check_copy_availability()
RETURNS TRIGGER AS $$
DECLARE
    current_status VARCHAR;
BEGIN
    SELECT status INTO current_status FROM copies WHERE id = NEW.copy_id;

    IF current_status <> 'AVAILABLE' THEN
        RAISE EXCEPTION 'Business Rule Violation: Copy % is currently % and cannot be loaned.', NEW.copy_id, current_status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: prevent_deletion_strict (NEW)
-- Strictly prevents deletion from critical tables (loans, fines)
CREATE OR REPLACE FUNCTION prevent_deletion_strict()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Security Violation: Deleting records from % is strictly forbidden. Use status updates (CANCELLED/WAIVED) instead.', TG_TABLE_NAME;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function: prevent_fine_modification (NEW)
-- Prevents changing amount or reason of a fine. Only status/payment date can change.
CREATE OR REPLACE FUNCTION prevent_fine_modification()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.amount <> NEW.amount) THEN
        RAISE EXCEPTION 'Data Integrity Violation: Fine amount cannot be changed. Cancel/Waive this fine and create a new one if needed.';
    END IF;
    IF (OLD.reason <> NEW.reason) THEN
        RAISE EXCEPTION 'Data Integrity Violation: Fine reason cannot be changed.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: check_copy_active_loans
CREATE OR REPLACE FUNCTION check_copy_active_loans()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM loans WHERE copy_id = OLD.id AND status IN ('ACTIVE', 'OVERDUE')) THEN
        RAISE EXCEPTION 'Data Integrity Violation: Cannot delete Copy % because it is currently on loan.', OLD.id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;


-- ------------------------------------------
-- C. PERFORMANCE
-- ------------------------------------------

-- Function: update_author_book_count
CREATE OR REPLACE FUNCTION update_author_book_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE authors SET book_count = COALESCE(book_count, 0) + 1 WHERE id = NEW.author_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE authors SET book_count = COALESCE(book_count, 0) - 1 WHERE id = OLD.author_id;
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.author_id <> NEW.author_id) THEN
            UPDATE authors SET book_count = COALESCE(book_count, 0) - 1 WHERE id = OLD.author_id;
            UPDATE authors SET book_count = COALESCE(book_count, 0) + 1 WHERE id = NEW.author_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function: update_available_copies
CREATE OR REPLACE FUNCTION update_available_copies()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.status = 'AVAILABLE') THEN
            UPDATE books SET available_copies = COALESCE(available_copies, 0) + 1 WHERE id = NEW.book_id;
        END IF;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.status != 'AVAILABLE' AND NEW.status = 'AVAILABLE') THEN
            UPDATE books SET available_copies = COALESCE(available_copies, 0) + 1 WHERE id = NEW.book_id;
        ELSIF (OLD.status = 'AVAILABLE' AND NEW.status != 'AVAILABLE') THEN
            UPDATE books SET available_copies = COALESCE(available_copies, 0) - 1 WHERE id = NEW.book_id;
        END IF;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.status = 'AVAILABLE') THEN
            UPDATE books SET available_copies = COALESCE(available_copies, 0) - 1 WHERE id = OLD.book_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- ------------------------------------------
-- D. TRIGGER DEFINITIONS
-- ------------------------------------------

-- 1. Auditing Triggers
DROP TRIGGER IF EXISTS trg_audit_books ON books;
CREATE TRIGGER trg_audit_books
AFTER UPDATE OR DELETE ON books
FOR EACH ROW EXECUTE FUNCTION log_book_changes();

DROP TRIGGER IF EXISTS trg_audit_loans ON loans;
CREATE TRIGGER trg_audit_loans
AFTER UPDATE OR DELETE ON loans
FOR EACH ROW EXECUTE FUNCTION log_loan_changes();

-- 2. Integrity Triggers
DROP TRIGGER IF EXISTS trg_check_stock ON books;
CREATE TRIGGER trg_check_stock
BEFORE INSERT OR UPDATE ON books
FOR EACH ROW EXECUTE FUNCTION check_book_stock();

DROP TRIGGER IF EXISTS trg_protect_loan_history ON loans;
CREATE TRIGGER trg_protect_loan_history
BEFORE UPDATE ON loans
FOR EACH ROW EXECUTE FUNCTION prevent_loan_modification();

DROP TRIGGER IF EXISTS trg_check_loan_eligibility ON loans;
CREATE TRIGGER trg_check_loan_eligibility
BEFORE INSERT ON loans
FOR EACH ROW EXECUTE FUNCTION check_copy_availability();

DROP TRIGGER IF EXISTS trg_protect_active_loans ON loans;
DROP TRIGGER IF EXISTS trg_no_delete_loans ON loans;
CREATE TRIGGER trg_no_delete_loans
BEFORE DELETE ON loans
FOR EACH ROW EXECUTE FUNCTION prevent_deletion_strict();

DROP TRIGGER IF EXISTS trg_no_delete_fines ON fines;
CREATE TRIGGER trg_no_delete_fines
BEFORE DELETE ON fines
FOR EACH ROW EXECUTE FUNCTION prevent_deletion_strict();

DROP TRIGGER IF EXISTS trg_protect_fine_integrity ON fines;
CREATE TRIGGER trg_protect_fine_integrity
BEFORE UPDATE ON fines
FOR EACH ROW EXECUTE FUNCTION prevent_fine_modification();

DROP TRIGGER IF EXISTS trg_prevent_copy_deletion ON copies;
CREATE TRIGGER trg_prevent_copy_deletion
BEFORE DELETE ON copies
FOR EACH ROW EXECUTE FUNCTION check_copy_active_loans();

-- 3. Performance Triggers
DROP TRIGGER IF EXISTS trg_update_author_stats ON book_authors;
CREATE TRIGGER trg_update_author_stats
AFTER INSERT OR UPDATE OR DELETE ON book_authors
FOR EACH ROW EXECUTE FUNCTION update_author_book_count();

DROP TRIGGER IF EXISTS trg_update_available_copies ON copies;
CREATE TRIGGER trg_update_available_copies
AFTER INSERT OR UPDATE OR DELETE ON copies
FOR EACH ROW EXECUTE FUNCTION update_available_copies();
