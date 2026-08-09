import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

const seedCategories = [
  { name: 'baby', description: 'Clothing and accessories for babies (0-24 months)' },
  { name: 'toddler', description: 'Clothing for toddlers (2-5 years)' },
  { name: 'accessories', description: 'Hats, socks, bibs, and other accessories' },
  { name: 'shoes', description: 'Footwear for babies and toddlers' },
  { name: 'gifts', description: 'Gift sets and special occasions' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for categories');
    
    for (const cat of seedCategories) {
      await Category.updateOne(
        { name: cat.name },
        { $set: cat },
        { upsert: true }
      );
    }
    
    console.log(`Seeded categories successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seed();
