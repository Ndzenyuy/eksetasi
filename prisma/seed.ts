import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      name: 'John Teacher',
      password: await bcrypt.hash('teacher123', 10),
      role: 'TEACHER',
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'Jane Student',
      password: await bcrypt.hash('student123', 10),
      role: 'STUDENT',
    },
  });

  console.log('✅ Users created');

  // Create JavaScript questions
  const jsQuestions = await Promise.all([
    prisma.question.create({
      data: {
        text: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          { id: 'a', text: 'var myVariable;', isCorrect: true },
          { id: 'b', text: 'variable myVariable;', isCorrect: false },
          { id: 'c', text: 'v myVariable;', isCorrect: false },
          { id: 'd', text: 'declare myVariable;', isCorrect: false },
        ],
        correctAnswer: 'a',
        explanation: 'In JavaScript, variables can be declared using var, let, or const keywords. The var keyword is one of the traditional ways to declare variables.',
        category: 'Variables',
        difficulty: 'EASY',
        createdById: teacherUser.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Which of the following is NOT a JavaScript data type?',
        options: [
          { id: 'a', text: 'String', isCorrect: false },
          { id: 'b', text: 'Boolean', isCorrect: false },
          { id: 'c', text: 'Float', isCorrect: true },
          { id: 'd', text: 'Number', isCorrect: false },
        ],
        correctAnswer: 'c',
        explanation: 'JavaScript has a Number type for all numeric values (integers and floating-point). There is no separate Float type like in some other languages.',
        category: 'Data Types',
        difficulty: 'MEDIUM',
        createdById: teacherUser.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'What does the "===" operator do in JavaScript?',
        options: [
          { id: 'a', text: 'Assigns a value', isCorrect: false },
          { id: 'b', text: 'Compares values only', isCorrect: false },
          { id: 'c', text: 'Compares values and types', isCorrect: true },
          { id: 'd', text: 'Declares a constant', isCorrect: false },
        ],
        correctAnswer: 'c',
        explanation: 'The === operator performs strict equality comparison, checking both the value and the type. This is different from == which only compares values with type coercion.',
        category: 'Operators',
        difficulty: 'MEDIUM',
        createdById: teacherUser.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'Which method is used to add an element to the end of an array?',
        options: [
          { id: 'a', text: 'push()', isCorrect: true },
          { id: 'b', text: 'add()', isCorrect: false },
          { id: 'c', text: 'append()', isCorrect: false },
          { id: 'd', text: 'insert()', isCorrect: false },
        ],
        correctAnswer: 'a',
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
        category: 'Arrays',
        difficulty: 'EASY',
        createdById: teacherUser.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'What is a closure in JavaScript?',
        options: [
          { id: 'a', text: 'A way to close the browser', isCorrect: false },
          { id: 'b', text: 'A function that has access to outer scope variables', isCorrect: true },
          { id: 'c', text: 'A method to end a loop', isCorrect: false },
          { id: 'd', text: 'A type of error', isCorrect: false },
        ],
        correctAnswer: 'b',
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This is a powerful feature in JavaScript.',
        category: 'Functions',
        difficulty: 'HARD',
        createdById: teacherUser.id,
      },
    }),
  ]);

  console.log('✅ JavaScript questions created');

  // Create Python questions
  const pythonQuestions = await Promise.all([
    prisma.question.create({
      data: {
        text: 'Which of the following is the correct way to create a list in Python?',
        options: [
          { id: 'a', text: 'list = []', isCorrect: true },
          { id: 'b', text: 'list = {}', isCorrect: false },
          { id: 'c', text: 'list = ()', isCorrect: false },
          { id: 'd', text: 'list = ""', isCorrect: false },
        ],
        correctAnswer: 'a',
        explanation: 'Square brackets [] are used to create lists in Python. Curly braces {} create dictionaries, parentheses () create tuples, and quotes create strings.',
        category: 'Data Structures',
        difficulty: 'EASY',
        createdById: teacherUser.id,
      },
    }),
    prisma.question.create({
      data: {
        text: 'What is the output of print(type(5.0))?',
        options: [
          { id: 'a', text: '<class \'int\'>', isCorrect: false },
          { id: 'b', text: '<class \'float\'>', isCorrect: true },
          { id: 'c', text: '<class \'number\'>', isCorrect: false },
          { id: 'd', text: '<class \'decimal\'>', isCorrect: false },
        ],
        correctAnswer: 'b',
        explanation: 'Numbers with decimal points (like 5.0) are automatically treated as float type in Python, even if the decimal part is zero.',
        category: 'Data Types',
        difficulty: 'EASY',
        createdById: teacherUser.id,
      },
    }),
  ]);

  console.log('✅ Python questions created');

  // Create exams
  const jsExam = await prisma.exam.create({
    data: {
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
      timeLimit: 30,
      passingScore: 60,
      isActive: true,
      createdById: teacherUser.id,
    },
  });

  const pythonExam = await prisma.exam.create({
    data: {
      title: 'Python Basics',
      description: 'Fundamental concepts of Python programming including syntax, data structures, and control flow.',
      timeLimit: 25,
      passingScore: 60,
      isActive: true,
      createdById: teacherUser.id,
    },
  });

  console.log('✅ Exams created');

  // Link questions to exams
  await Promise.all([
    ...jsQuestions.map((question, index) =>
      prisma.examQuestion.create({
        data: {
          examId: jsExam.id,
          questionId: question.id,
          order: index + 1,
        },
      })
    ),
    ...pythonQuestions.map((question, index) =>
      prisma.examQuestion.create({
        data: {
          examId: pythonExam.id,
          questionId: question.id,
          order: index + 1,
        },
      })
    ),
  ]);

  console.log('✅ Questions linked to exams');

  // Create sample attempt and result for testing
  const attempt = await prisma.attempt.create({
    data: {
      studentId: studentUser.id,
      examId: jsExam.id,
      endTime: new Date(),
      answers: {
        [jsQuestions[0].id]: 'a', // Correct
        [jsQuestions[1].id]: 'b', // Incorrect (correct is 'c')
        [jsQuestions[2].id]: 'c', // Correct
        [jsQuestions[3].id]: 'a', // Correct
        [jsQuestions[4].id]: 'a', // Incorrect (correct is 'b')
      },
      score: 3,
      status: 'COMPLETED',
    },
  });

  await prisma.result.create({
    data: {
      attemptId: attempt.id,
      studentId: studentUser.id,
      examId: jsExam.id,
      score: 3,
      percentage: 60.0,
      passed: true,
      feedback: 'Good job! You passed the exam.',
    },
  });

  console.log('✅ Sample attempt and result created');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
