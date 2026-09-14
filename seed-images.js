require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const urls = {
  hero: 'https://res.cloudinary.com/dfpabtrke/image/upload/v1789345617/jasmarkids_seed/tpyl82swo1guaoqyz6ft.jpg',
  boy: 'https://res.cloudinary.com/dfpabtrke/image/upload/v1789345622/jasmarkids_seed/cvtvyfx5asrjdpzhcuja.jpg',
  girl: 'https://res.cloudinary.com/dfpabtrke/image/upload/v1789345628/jasmarkids_seed/shypvmyd0eunj5w346pl.jpg',
  baby: 'https://res.cloudinary.com/dfpabtrke/image/upload/v1789345631/jasmarkids_seed/jyfyyjiu4ogqdn7nbbow.jpg'
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    const settingsCollection = db.collection('settings');
    
    console.log('Connected to MongoDB');

    // Update settings in DB
    const globalSettings = await settingsCollection.findOne({ key: 'global' });
    if (globalSettings) {
      if (!globalSettings.heroCarousel || globalSettings.heroCarousel.length === 0) {
        globalSettings.heroCarousel = [{
          title: "ICONIC\nFOR\nAUTUMN",
          subtitle: "Charming outfits for the season's best moments.",
          ctaText: "Shop Boys",
          ctaLink: "/category/boy"
        }];
      }
      globalSettings.heroCarousel[0].imageUrl = urls.hero;
      
      if (!globalSettings.featuredCategories || globalSettings.featuredCategories.length === 0) {
        globalSettings.featuredCategories = [
          { title: "Shop Boy", link: "/category/boy", imageUrl: "" },
          { title: "Shop Baby", link: "/category/baby", imageUrl: "" },
          { title: "Shop Girl", link: "/category/girl", imageUrl: "" }
        ];
      }

      const boyCat = globalSettings.featuredCategories.find(c => c.link.includes('boy'));
      if (boyCat) boyCat.imageUrl = urls.boy;

      const girlCat = globalSettings.featuredCategories.find(c => c.link.includes('girl'));
      if (girlCat) girlCat.imageUrl = urls.girl;

      const babyCat = globalSettings.featuredCategories.find(c => c.link.includes('baby'));
      if (babyCat) babyCat.imageUrl = urls.baby;

      await settingsCollection.updateOne({ key: 'global' }, { $set: globalSettings });
      console.log('Database seeded with Cloudinary URLs successfully!');
    } else {
      console.log('Settings not found in database. Please run the backend first to seed defaults.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seed();
