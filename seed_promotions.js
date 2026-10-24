const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abahmarquis_db_user:VtlSkCktZ247MihJ@kiddies-ecommerce.hmvzzwz.mongodb.net/?appName=kiddies-ecommerce';

const promotionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  type: String,
  imageUrl: String,
  backgroundColor: String,
  ctaText: String,
  ctaLink: String,
  isActive: { type: Boolean, default: true },
  categoryTarget: String,
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);

const promos = [
  {
    title: "ICONIC FOR AUTUMN",
    subtitle: "Charming outfits for the season's best moments.",
    type: "hero",
    imageUrl: "https://images.unsplash.com/photo-1546950007-4e58be5bfaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    backgroundColor: "#f1a415",
    ctaText: "SHOP NOW",
    ctaLink: "/products",
    isActive: true,
  },
  {
    title: "KIDS COSTUMES & DRESS-UP",
    subtitle: "Superhero, fairytale and party costumes for kids.",
    type: "megamenu_ad",
    categoryTarget: "costumes",
    imageUrl: "/img/category_costumes_african.jpg",
    ctaText: "EXPLORE COSTUMES",
    ctaLink: "/category/costumes",
    isActive: true,
  },
  {
    title: "GIRLS NEW ARRIVALS",
    subtitle: "Fall styles she will love.",
    type: "megamenu_ad",
    categoryTarget: "girl",
    imageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ctaText: "SHOP GIRLS",
    ctaLink: "/category/girl",
    isActive: true,
  },
  {
    title: "BOYS COOL FINDS",
    subtitle: "Gear up for game day.",
    type: "megamenu_ad",
    categoryTarget: "boy",
    imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ctaText: "SHOP BOYS",
    ctaLink: "/category/boy",
    isActive: true,
  },
  {
    title: "LITTLE LOOKS",
    subtitle: "Adorable toddler styles.",
    type: "megamenu_ad",
    categoryTarget: "toddler-girl",
    imageUrl: "https://images.unsplash.com/photo-1519238396254-07e86895ce40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ctaText: "SHOP TODDLER",
    ctaLink: "/category/toddler-girl",
    isActive: true,
  },
  {
    title: "TINY TRENDS",
    subtitle: "Soft fabrics for baby.",
    type: "megamenu_ad",
    categoryTarget: "baby",
    imageUrl: "https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ctaText: "SHOP BABY",
    ctaLink: "/category/baby",
    isActive: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Promotion.deleteMany({});
    await Promotion.insertMany(promos);
    console.log("Promotions seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
