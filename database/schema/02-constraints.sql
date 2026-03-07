-- ==========================================
-- 2. CONSTRAINTS & INDEXES
-- ==========================================

-- Foreign Keys for 'books'
ALTER TABLE books ADD CONSTRAINT fk_books_category FOREIGN KEY (category_id) REFERENCES categories(id);

-- Foreign Keys for 'book_authors'
ALTER TABLE book_authors ADD CONSTRAINT fk_bookauthors_book FOREIGN KEY (book_id) REFERENCES books(id);
ALTER TABLE book_authors ADD CONSTRAINT fk_bookauthors_author FOREIGN KEY (author_id) REFERENCES authors(id);

-- Foreign Keys for 'copies'
ALTER TABLE copies ADD CONSTRAINT fk_copies_book FOREIGN KEY (book_id) REFERENCES books(id);

-- Foreign Keys for 'loans'
ALTER TABLE loans ADD CONSTRAINT fk_loans_copy FOREIGN KEY (copy_id) REFERENCES copies(id);
ALTER TABLE loans ADD CONSTRAINT fk_loans_user FOREIGN KEY (user_id) REFERENCES users(id);

-- Foreign Keys for 'fines'
ALTER TABLE fines ADD CONSTRAINT fk_fines_loan FOREIGN KEY (loan_id) REFERENCES loans(id);
ALTER TABLE fines ADD CONSTRAINT fk_fines_user FOREIGN KEY (user_id) REFERENCES users(id);

-- Foreign Keys for 'refresh_tokens'
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refreshtokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Foreign Keys for 'user_roles'
ALTER TABLE user_roles ADD CONSTRAINT fk_userroles_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_roles ADD CONSTRAINT fk_userroles_role FOREIGN KEY (role) REFERENCES roles(name);

-- Foreign Keys for 'user_notification_preferences'
ALTER TABLE user_notification_preferences ADD CONSTRAINT fk_usernotifpref_user FOREIGN KEY (user_id) REFERENCES users(id);

-- Foreign Keys for 'user_notification_preference_channels'
ALTER TABLE user_notification_preference_channels ADD CONSTRAINT fk_usernotifprefchan_pref FOREIGN KEY (preference_id) REFERENCES user_notification_preferences(id);


-- Indexes
CREATE INDEX idx_loans_user ON loans (user_id);
CREATE INDEX idx_loans_copy ON loans (copy_id);
CREATE INDEX idx_loans_active ON loans (return_date);
