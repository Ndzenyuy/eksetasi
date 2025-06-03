# Database Setup Guide

This guide will help you set up PostgreSQL database for the MCQ Exam System.

## Prerequisites

1. **PostgreSQL** installed on your system
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

2. **Node.js dependencies** installed
   ```bash
   npm install
   ```

## Quick Setup

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE mcq_exam_system;
   ```

2. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mcq_exam_system?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

3. **Run the setup script:**
   ```bash
   chmod +x scripts/setup-db.sh
   ./scripts/setup-db.sh
   ```

## Manual Setup

If you prefer to run commands manually:

1. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Seed the database:**
   ```bash
   npm run db:seed
   ```

## Database Schema

The database includes the following models:

### Users
- ID, Name, Email, Password (hashed), Role, Timestamps

### Questions
- ID, Text, Options (JSON), Correct Answer, Explanation, Category, Difficulty, Created By, Timestamps

### Exams
- ID, Title, Description, Time Limit, Passing Score, Availability, Created By, Timestamps

### Attempts
- ID, Student ID, Exam ID, Start/End Time, Answers (JSON), Score, Status, Timestamps

### Results
- ID, Attempt ID, Student ID, Exam ID, Score, Percentage, Pass/Fail, Feedback, Timestamps

## Test Accounts

After seeding, you can use these test accounts:

- **Admin:** admin@example.com / admin123
- **Teacher:** teacher@example.com / teacher123
- **Student:** student@example.com / student123

## Useful Commands

- **View database:** `npm run db:studio`
- **Reset database:** `npx prisma migrate reset`
- **Deploy migrations:** `npx prisma migrate deploy`
- **Generate client:** `npx prisma generate`

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running
- Check your DATABASE_URL in .env
- Verify database exists and user has permissions

### Migration Issues
- Try resetting: `npx prisma migrate reset`
- Check for schema conflicts
- Ensure Prisma client is generated

### Seeding Issues
- Check if database is empty
- Verify all dependencies are installed
- Run `npx prisma db push` first if needed

## Production Deployment

For production:

1. Use environment variables for sensitive data
2. Use connection pooling (PgBouncer)
3. Set up database backups
4. Use SSL connections
5. Monitor database performance

## Database Indexes

Consider adding these indexes for better performance:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_attempts_student_exam ON attempts(student_id, exam_id);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);
```
