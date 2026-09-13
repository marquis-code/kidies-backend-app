import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { UserSchema } from './src/auth/schemas/user.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jasmarkids';

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@jasmarkids.com';
    const password = 'password123';
    
    // Hash password exactly how the app does it
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email });

    if (user) {
      console.log('Admin user found, resetting password...');
      // Use findByIdAndUpdate to bypass any presave hooks that might mess up double hashing if there's a bug
      await User.updateOne({ _id: user._id }, { $set: { passwordHash, role: 'admin' } });
      console.log('Admin password reset successfully to: ' + password);
    } else {
      console.log('Admin user not found, creating new...');
      const newAdmin = new User({
        email,
        firstName: 'Admin',
        lastName: 'User',
        passwordHash, // pre-save hook might hash this again if not careful, let's bypass it using insertOne
        role: 'admin'
      });
      // to avoid pre-save hook double hashing
      await User.collection.insertOne({
        email,
        firstName: 'Admin',
        lastName: 'User',
        passwordHash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Admin user created successfully with password: ' + password);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
