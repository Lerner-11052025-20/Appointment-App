const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({
      email: 'admin.global@gmail.com',
    });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists. Skipping seed.');
      process.exit(0);
    }

    await User.create({
      fullName: 'System Administrator',
      email: 'admin.global@gmail.com',
      password: 'admin.global',
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('   Email:    admin.global@gmail.com');
    console.log('   Password: admin.global');
    console.log('   Role:     admin\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();