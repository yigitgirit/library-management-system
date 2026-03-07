-- ==========================================
-- 0. CLEANUP
-- Drops the public schema to ensure a fresh start.
-- WARNING: DELETES ALL DATA. USE ONLY IN DEV/TEST.
-- ==========================================

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
