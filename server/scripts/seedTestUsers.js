require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = 'mongodb://localhost:27017/teamforge';

const USERS = [
    {
        fullName: 'John Doe',
        email: 'john@test.com',
        password: 'john123',
        skills: ['React', 'Node', 'MongoDB'],
        interests: ['Startups', 'AI'],
        availability: 'High',
        profileImage: `/profiles/11.jpg`,
    },
    {
        fullName: 'Jane Smith',
        email: 'jane@test.com',
        password: 'jane123',
        skills: ['Design', 'Figma', 'UI'],
        interests: ['UX', 'Art'],
        availability: 'Medium',
        profileImage: `/profiles/11.jpg`,
    },
    {
        fullName: 'Anand Sai',
        email: 'anand@test.com',
        password: 'anand123',
        skills: ['Python', 'ML'],
        interests: ['AI', 'Research'],
        availability: 'High',
        profileImage: `/profiles/11.jpg`,
    },
    {
        fullName: 'Bhaskar Teja',
        email: 'bhaskar@test.com',
        password: 'bhaskar123',
        skills: ['MERN', 'System Design'],
        interests: ['Startups', 'Open Source'],
        availability: 'Medium',
        profileImage: `/profiles/2.jpg`,
    },
    {
        fullName: 'Sarah Chen',
        email: 'sarah@test.com',
        password: 'sarah123',
        skills: ['React', 'TypeScript', 'Tailwind'],
        interests: ['Open Source', 'UI'],
        availability: 'High',
        profileImage: `/profiles/3.jpg`,
    },
    {
        fullName: 'Michael Ross',
        email: 'michael@test.com',
        password: 'michael123',
        skills: ['Python', 'Django', 'PostgreSQL'],
        interests: ['Startups', 'Research'],
        availability: 'Low',
        profileImage: `/profiles/4.jpg`,
    },
    {
        fullName: 'Elena Rodriguez',
        email: 'elena@test.com',
        password: 'elena123',
        skills: ['Figma', 'Adobe XD', 'React'],
        interests: ['UX', 'Art', 'Startups'],
        availability: 'Medium',
        profileImage: `/profiles/5.jpg`,
    },
    {
        fullName: 'David Kwong',
        email: 'david@test.com',
        password: 'david123',
        skills: ['Node', 'Express', 'AWS'],
        interests: ['AI', 'System Design'],
        availability: 'High',
        profileImage: `/profiles/6.jpg`,
    },
    {
        fullName: 'Priya Sharma',
        email: 'priya@test.com',
        password: 'priya123',
        skills: ['ML', 'PyTorch', 'Python'],
        interests: ['AI', 'Open Source'],
        availability: 'Medium',
        profileImage: `/profiles/7.jpg`,
    },
];

// Auto-generate remaining users
while (USERS.length < 15) {
    const i = USERS.length + 1;
    USERS.push({
        fullName: `Test User ${i}`,
        email: `test${i}@test.com`,
        password: `test${i}123`,
        skills: ['JavaScript', 'HTML', 'CSS'].slice(1, i % 3 + 1),
        interests: ['Web', 'Tech'].slice(0, i % 2 + 1),
        availability: ['High', 'Medium', 'Low'][i % 3],
        profileImage: `/profiles/${i % 20 + 1}.jpg`,
    });
}

(async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');

        for (const u of USERS) {
            const exists = await User.findOne({ email: u.email });
            if (exists) {
                console.log(`⏭ Skipping ${u.email} (already exists)`);
                continue;
            }

            const hash = await bcrypt.hash(u.password, 10);

            await User.create({
                fullName: u.fullName,
                email: u.email,
                password: hash,
                bio: `Hi, I'm ${u.fullName}`,
                skills: u.skills,
                interests: u.interests,
                availability: u.availability,
                role: 'student',
                profileImage: u.profileImage,
            });

            console.log(`✅ Created: ${u.email} | password: ${u.password}`);
        }

        console.log('🎉 Test users ready');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
