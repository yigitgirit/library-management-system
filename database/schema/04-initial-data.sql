-- ==========================================
-- 4. SEED DATA
-- Initial data required for the application to function.
-- ==========================================

-- 1. Roles
INSERT INTO roles (name) VALUES
('ADMIN'),
('MEMBER'),
('LIBRARIAN')
ON CONFLICT (name) DO NOTHING;

-- 2. Admin User
-- Password is 'Password123!' (BCrypt hash)
INSERT INTO users (email, first_name, last_name, password, status, version, created_at, updated_at)
VALUES ('admin@library.com', 'Admin', 'User', '$2a$12$9cyN820zhufy4uUMYMy5LOe7K9rotfMxsqYrJP9qfejcmaCaaQIgG', 'ACTIVE', 0, NOW(), NOW())
    ON CONFLICT (email) DO NOTHING;

-- 3. Assign Admin Role
INSERT INTO user_roles (user_id, role)
SELECT id, 'ADMIN' FROM users WHERE email = 'admin@library.com'
    ON CONFLICT (user_id, role) DO NOTHING;
