import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema, 'products');

async function seedAdditionalInformation() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const result = await Product.updateMany(
    { additionalInformation: { $exists: false } },
    {
      $set: {
        additionalInformation: "Made with 100% premium cotton for ultimate comfort. Machine wash cold, tumble dry low. Designed in Lagos, ethically manufactured.",
        averageRating: 0,
        reviewCount: 0
      }
    }
  );

  console.log(`Updated ${result.modifiedCount} products with additional information and rating fields.`);
  await mongoose.disconnect();
}

seedAdditionalInformation().catch(console.error);
