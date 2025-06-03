-- Setup script for local PostgreSQL
-- Run this with: psql -U postgres -f setup-local-db.sql

-- Create user
CREATE USER mcq_user WITH PASSWORD 'mcq_password';

-- Create database
CREATE DATABASE mcq_exam_system OWNER mcq_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mcq_exam_system TO mcq_user;

-- Connect to the database and grant schema privileges
\c mcq_exam_system;
GRANT ALL ON SCHEMA public TO mcq_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcq_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcq_user;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\echo 'Database setup completed successfully!'
