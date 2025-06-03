-- Initialize MCQ Exam System Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE mcq_exam_system TO mcq_user;

-- Set timezone
SET timezone = 'UTC';
