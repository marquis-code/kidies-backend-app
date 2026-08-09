import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { ProductSchema } from './src/products/schemas/product.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin';
const Product = mongoose.model('Product', ProductSchema);

const unsplashImages = [
  'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1471286174890-9c11241eb081?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611428813653-aa60f473fce3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621459580436-1517441bb25c?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560506840-0ca914bbd2a8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1619864228392-5eb3268484a0?q=80&w=800&auto=format&fit=crop'
];

async function updateProductImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    let count = 0;
    for (const product of products) {
      const randomImage = unsplashImages[Math.floor(Math.random() * unsplashImages.length)];
      
      product.imageUrls = {
        thumbnail: randomImage.replace('w=800', 'w=150'),
        medium: randomImage.replace('w=800', 'w=400'),
        large: randomImage,
        original: randomImage
      };
      
      await product.save();
      count++;
    }

    console.log(`Successfully updated images for ${count} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating images:', error);
    process.exit(1);
  }
}

updateProductImages();
