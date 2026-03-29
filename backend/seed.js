const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');

const studentsData = [
  {
    name: 'Malik Haris Arshad',
    address: 'R block model town lahore',
    phone: '+923001262013',
    email: 'malikharisarshad29@gmail.com',
    status: 'Student',
    college: 'Punjab college',
    degree: 'FSC Pre Engineering',
  },
  {
    name: 'Muhammad Adil Baltistani',
    address: 'House 12-A Street 56 Ali Street Haji Park Rajgarh Lahore',
    phone: '+923499214468',
    email: 'm.adilbaltistani@gmail.com',
    status: 'Student',
    college: 'ITU',
    degree: 'BS Software Engineering',
  },
  {
    name: 'Rao Hashir',
    address: 'Model Town extension s block dalha bazar near good pizza',
    phone: '+923269414322',
    email: 'raoh54667@gmail.com',
    status: 'Student',
    college: 'Punjab College',
    degree: 'FSC Pre Engineering',
  },
  {
    name: 'Husnain Murtaza',
    address: 'Kalma Chowk Ferozepur Road Gulberg 3 Lahore',
    phone: '+923064273793',
    email: 'murtazahusnain06@gmail.com',
    status: 'Student',
    college: 'ITU',
    degree: 'BS Computer Engineering',
  },
  {
    name: 'Muhammad Zain Ahmad',
    address: 'E-185 Ansari Street Gulshan Park Lahore Cantt',
    phone: '+923187177046',
    email: 'izainahd@gmail.com',
    status: 'Student',
    college: 'PU',
    degree: 'Bs Cyber Security',
  },
  {
    name: 'M. Arslan Saeed',
    address: 'House no 593 j block Johar town',
    phone: '+923337919666',
    email: 'arslansaeed7687@gmail.com',
    status: 'Student',
    college: 'ITU',
    degree: 'BS Computer Engineering',
  },
  {
    name: 'Mustafa Ali',
    address: '135 B Block Gulshan Ravi Lahore',
    phone: '+923353110206',
    email: 'whoismustafa40@gmail.com',
    status: 'Student',
    college: 'PAC GULBERG',
    degree: 'CA',
  },
  {
    name: 'Syed Zojaja Khadim',
    address: 'H no 147 near darbar mian meer dharampura lahore',
    phone: '+923064798559',
    email: 'khadimzojaja@gmail.com',
    status: 'Student',
    college: 'ITU',
    degree: 'BS Computer Engineering',
  },
  {
    name: 'Ali Akbar',
    address: 'House no. 70 Gulshan e ravi Lahore',
    phone: '+923079419122',
    email: 'aliakbardps7@gmail.com',
    status: 'Student',
    college: 'Punjab College 8A',
    degree: '12th class',
  },
  {
    name: 'Syed Arham Naqee',
    address: 'house no 369 block sunflower bahria Nasheman',
    phone: '+923332858766',
    email: 'syedarhamnaqee@gmail.com',
    status: 'Student',
    college: 'AIR University',
    degree: 'BS cyber security',
  },
  {
    name: 'Hassan Shahbaz',
    address: 'Street 11 Mian mir colony lahore cantt',
    phone: '+923484587399',
    email: 'hs4668674@gmail.com',
    status: 'Student',
    college: 'University of lahore',
    degree: 'BS Software Engineering',
  },
  {
    name: 'Mubeen Sarfraz',
    address: 'H#15/A st# 166 Shalimar town',
    phone: '+923368779006',
    email: 'mubeensarfraz99@gmail.com',
    status: 'Student',
    college: 'UET',
    degree: 'Business Data Analytics',
  },
  {
    name: 'Hamza Tanveer',
    address: '183 R2 block Johar Town Lahore',
    phone: '+923234957357',
    email: 'wattooh897@gmail.com',
    status: 'Student',
    college: 'Divisional Public School and Intermediate College Model town Lahore',
    degree: 'ICS',
  },
  {
    name: 'Muhammad Hammad',
    address: 'Mian meer colony Sardar House Street # 15 Lahore Cantt',
    phone: '+923224301912',
    email: 'rajpoothammad232@gmail.com',
    status: 'Student',
    college: 'UMT',
    degree: 'BS Civil Engineering',
  },
  {
    name: 'Zia Ullah Zafar',
    address: '102A PIA Society Johar Town Lahore',
    phone: '+923005807562',
    email: 'ziaullahzafar142@gmail.com',
    status: 'Student',
    college: 'CAPS College Lahore',
    degree: 'CA',
  },
  {
    name: 'Muhammad Hassaan',
    address: 'E27-7-E-4 Street no. 02 Mohallah Islamnagar Ghausia Colony Walton Road Lahore Cantt',
    phone: '+923328530697',
    email: 'ma2817475@gmail.com',
    status: 'Student',
    college: 'UET',
    degree: 'BS Computer Science',
  },
  {
    name: 'Hafiz Ali Akbar',
    address: '102A Block A PIA Society Johar town Lahore',
    phone: '+923004516495',
    email: 'aliakbar926422@gmail.com',
    status: 'Teacher/Professor',
    college: 'PGC AND UOL',
    degree: '',
  },
  {
    name: 'Muhammad Huzaifa Zuberi',
    address: 'Lahore Shalimar Town Daroghawala Nafirabad Dhobi Ghat C/O Mumtaz Medical and General Store',
    phone: '+923279414005',
    email: 'hhhzuberi3@gmail.com',
    status: 'Student',
    college: 'UET',
    degree: 'BS Chemical Engineering',
  },
  {
    name: 'Muhammad Noor Shaharyar',
    address: 'Ejaz park model town link road lahore',
    phone: '+923005625891',
    email: 'muhammadnoor280528@gmail.com',
    status: 'Student',
    college: 'Fast NUCES',
    degree: 'BS Data Science',
  },
  {
    name: 'Muhammad Fahad',
    address: 'House no 220 karim park ravi road lahore',
    phone: '+923000970026',
    email: 'm.fahad2602@gmail.com',
    status: 'Student',
    college: '(Gap Year)',
    degree: 'Automotive Engineering',
  },
  {
    name: 'Muhammad Ayan',
    address: 'Farooq colony Walton road Lahore street no 3 and house no E 26',
    phone: '+923221488338',
    email: 'malikayansab4@gmail.com',
    status: 'Student',
    college: 'Unique Group Of Institute',
    degree: 'Matric',
  },
  {
    name: 'Muhammad Muzamil',
    address: 'House #57 A street #7 New town kharak Multan Road lahore',
    phone: '+923274690008',
    email: 'muzamilmoqeem@gmail.com',
    status: 'Student',
    college: 'UET',
    degree: 'BS Computer Science',
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wisdom-attendance';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany({}), Student.deleteMany({})]);
  console.log('Cleared existing users and students');

  // Create admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@wisdom.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log(`Admin created: ${admin.email}`);

  // Create students and their user accounts
  for (const data of studentsData) {
    const student = await Student.create(data);
    await User.create({
      name: data.name,
      email: data.email,
      password: 'student123',
      role: 'student',
      studentId: student._id,
    });
    console.log(`Student created: ${data.name} (${data.email})`);
  }

  console.log('\nSeeding complete!');
  console.log(`  Admin  -> email: admin@wisdom.com | password: admin123`);
  console.log(`  Students -> password: student123`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
