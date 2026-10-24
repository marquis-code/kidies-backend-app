import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { CategorySchema } from './src/categories/schemas/category.schema';
import { ProductSchema } from './src/products/schemas/product.schema';
import { OrderSchema } from './src/orders/schemas/order.schema';
import { ProductPolicySchema } from './src/product-policies/schemas/product-policy.schema';
import { CouponSchema } from './src/coupons/coupon.schema';
import { AuditLogSchema } from './src/audit-logs/schemas/audit-log.schema';
import { UserSchema } from './src/auth/schemas/user.schema';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin';

const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const ProductPolicy = mongoose.model('ProductPolicy', ProductPolicySchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
const User = mongoose.model('User', UserSchema);

// ── Real children's clothing image URLs (stable Unsplash CDN) ─────────────────
const IMG = {
  // Boys
  boysPolo: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop',
  boysJeans: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop',
  boysJacket: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=600&fit=crop',
  boysSweater: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=600&fit=crop',
  boysTshirt: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600&h=600&fit=crop',
  boysShorts: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop',
  boysSwimwear: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=600&fit=crop',
  boysHoodie: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600&h=600&fit=crop',
  // Girls
  girlsDress: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=600&fit=crop',
  girlsSkirt: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600&h=600&fit=crop',
  girlsTop: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=600&h=600&fit=crop',
  girlsCardigan: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop',
  girlsLeggings: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=600&fit=crop',
  girlsCoat: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=600&fit=crop',
  girlsPajamas: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop',
  girlsRomper: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=600&fit=crop',
  // Baby
  babyOnesie: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop',
  babyRomper: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&h=600&fit=crop',
  babyDress: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=600&fit=crop',
  babySleeper: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&h=600&fit=crop',
  babySet: 'https://images.unsplash.com/photo-1555009393-f20bdb245c4d?w=600&h=600&fit=crop',
  babySwaddle: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&h=600&fit=crop',
  // Toddler
  toddlerDungarees: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=600&fit=crop',
  toddlerDress: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop',
  toddlerSet: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&h=600&fit=crop',
  // Shoes
  kidsSneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
  kidsSandals: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=600&fit=crop',
  kidsBoots: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&h=600&fit=crop',
  // Accessories
  kidsBackpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
  kidsHat: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop',
  kidsSunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop',
  // Kids Costumes
  kidsCostume: '/img/category_costumes_african.jpg',
  partyPajamas: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=600&h=600&fit=crop',
  // Pajamas
  pajamasBoys: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&h=600&fit=crop',
  pajamasGirls: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop',
};

// Size presets by age group
const SIZES = {
  baby: ['NB', '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'],
  toddler: ['2T', '3T', '4T', '5T'],
  kids: ['XS (4)', 'S (5-6)', 'M (7-8)', 'L (10-12)', 'XL (14-16)'],
  shoes_baby: ['1', '2', '3', '4', '5'],
  shoes_toddler: ['5', '6', '7', '8', '9', '10'],
  shoes_kids: ['10', '11', '12', '13', '1Y', '2Y', '3Y'],
  onesize: ['One Size'],
};

function makeVariants(sizes: string[], colors: string[]) {
  const variants: any[] = [];
  for (const size of sizes) {
    for (const color of colors) {
      variants.push({
        size,
        color,
        sku: `${size}-${color}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        stockQuantity: Math.floor(Math.random() * 50) + 5,
      });
    }
  }
  return variants;
}

function makeImageUrls(url: string) {
  return {
    thumbnail: url.replace('w=600&h=600', 'w=150&h=150'),
    medium: url.replace('w=600&h=600', 'w=400&h=400'),
    large: url.replace('w=600&h=600', 'w=800&h=800'),
    original: url,
  };
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    try { await mongoose.connection.db!.collection('categories').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('products').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('orders').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('productpolicies').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('coupons').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('auditlogs').drop(); } catch (e) {}
    await User.deleteMany({ email: { $ne: 'admin@jasmarkids.com' } });

    await Category.init();
    await Product.init();
    await Order.init();
    await ProductPolicy.init();
    await Coupon.init();
    await AuditLog.init();

    console.log('Cleared existing data and indexes');

    // ── Seed Policies ─────────────────────────────────────────────────────────
    const policies = await ProductPolicy.insertMany([
      {
        name: 'Standard Kids Clothing',
        productDetails: 'Machine washable. Tumble dry low. Imported. Made with soft, breathable cotton blends safe for sensitive skin.',
        shippingAndReturns: 'Free shipping on orders $30+. Free returns within 30 days. Items must be unworn with tags attached.',
      },
      {
        name: 'Premium Outerwear',
        productDetails: 'Water-resistant outer shell. Spot clean or dry clean recommended. 100% polyester fill for warmth.',
        shippingAndReturns: 'Free shipping on orders $30+. Returns accepted within 30 days in original condition.',
      },
      {
        name: 'Shoes & Accessories',
        productDetails: 'Non-slip soles. Easy on/off design. Meets safety standards for children footwear.',
        shippingAndReturns: 'Free shipping on orders $30+. Shoes may be returned unworn within 14 days.',
      },
    ]);
    console.log(`Seeded ${policies.length} policies`);

    // ── Seed Categories ──────────────────────────────────────────────────────
    const categoryData = [
      { name: 'Boys', description: 'Cool and comfortable clothing for boys', status: 'active' },
      { name: 'Girls', description: 'Beautiful and stylish clothing for girls', status: 'active' },
      { name: 'Baby', description: 'Soft and safe clothing for babies 0-24 months', status: 'active' },
      { name: 'Toddler', description: 'Fun and durable clothing for toddlers 2-5 years', status: 'active' },
      { name: 'Shoes', description: 'Comfortable shoes for growing feet', status: 'active' },
      { name: 'Accessories', description: 'Hats, bags, and fun extras for kids', status: 'active' },
      { name: 'Pajamas', description: 'Cozy sleepwear for sweet dreams', status: 'active' },
      { name: 'Back to School', description: 'Everything they need for the school year', status: 'active' },
      { name: 'Sale', description: 'Great deals on kids clothing', status: 'active' },
      { name: 'Costumes', description: 'Fun dress-up costumes, superhero, fairytale and party wear for kids', status: 'active' },
    ];
    const categories = await Category.insertMany(categoryData);
    const catMap: Record<string, any> = {};
    categories.forEach(c => { catMap[c.name] = c._id; });
    console.log(`Seeded ${categories.length} categories`);

    // ── Seed Users ───────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@example.com', passwordHash },
      { firstName: 'Michael', lastName: 'Chen', email: 'michael@example.com', passwordHash },
      { firstName: 'Emma', lastName: 'Williams', email: 'emma@example.com', passwordHash },
      { firstName: 'James', lastName: 'Brown', email: 'james@example.com', passwordHash },
      { firstName: 'Olivia', lastName: 'Davis', email: 'olivia@example.com', passwordHash },
      { firstName: 'Demo', lastName: 'User', email: 'demo@jasmarkids.com', passwordHash },
    ]);
    console.log(`Seeded ${users.length} users`);

    // ── Seed Coupons ─────────────────────────────────────────────────────────
    const coupons = await Coupon.insertMany([
      { code: 'EXTRA40', discountType: 'percentage', discountValue: 40, isActive: true, expiryDate: new Date('2027-12-31') },
      { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, isActive: true, expiryDate: new Date('2027-12-31') },
      { code: 'SAVE20', discountType: 'fixed', discountValue: 20, isActive: true, expiryDate: new Date('2027-12-31') },
      { code: 'BACKTOSCHOOL', discountType: 'percentage', discountValue: 25, isActive: true, expiryDate: new Date('2027-01-31') },
      { code: 'FREESHIP', discountType: 'fixed', discountValue: 10, isActive: true, expiryDate: new Date('2027-12-31') },
    ]);
    console.log(`Seeded ${coupons.length} coupons`);

    // ── Seed Products (60+ real products) ────────────────────────────────────
    const productData = [
      // ─── BOYS ──────────────────────────────────────────────────────────
      {
        name: 'Boys Striped Polo Shirt',
        sku: 'BOY-POLO-001',
        description: 'Classic striped polo in soft cotton piqué. Perfect for school days or weekend outings. Features a two-button placket and ribbed collar.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 24.95,
        costPrice: 14.97,
        imageUrls: makeImageUrls(IMG.boysPolo),
        tags: ['back-to-school', 'best-seller', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Navy', 'Red', 'Green']),
        averageRating: 4.5,
        reviewCount: 127,
      },
      {
        name: 'Boys Slim-Fit Stretch Jeans',
        sku: 'BOY-JEAN-001',
        description: 'Comfortable stretch denim with adjustable waistband. Built to last through every adventure.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 29.95,
        costPrice: 17.97,
        imageUrls: makeImageUrls(IMG.boysJeans),
        tags: ['back-to-school', 'most-loved', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Dark Wash', 'Medium Wash', 'Black']),
        averageRating: 4.7,
        reviewCount: 89,
      },
      {
        name: 'Boys Puffer Jacket',
        sku: 'BOY-JACK-001',
        description: 'Lightweight water-resistant puffer with hood. Keeps boys warm without the bulk.',
        categoryId: catMap['Boys'],
        policyId: policies[1]._id,
        basePrice: 49.95,
        costPrice: 29.97,
        imageUrls: makeImageUrls(IMG.boysJacket),
        tags: ['most-loved', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Navy', 'Black', 'Forest Green']),
        averageRating: 4.8,
        reviewCount: 64,
      },
      {
        name: 'Boys Cable Knit Sweater',
        sku: 'BOY-SWTR-001',
        description: 'Cozy cable knit pullover in soft cotton blend. A wardrobe essential for cooler days.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 34.95,
        costPrice: 20.97,
        imageUrls: makeImageUrls(IMG.boysSweater),
        tags: ['back-to-school', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Heather Gray', 'Navy', 'Burgundy']),
        averageRating: 4.3,
        reviewCount: 52,
      },
      {
        name: 'Boys Graphic T-Shirt 3-Pack',
        sku: 'BOY-TEE-001',
        description: 'Fun graphic tees featuring dinosaurs, space, and adventure themes. Soft 100% cotton.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 19.95,
        costPrice: 11.97,
        imageUrls: makeImageUrls(IMG.boysTshirt),
        tags: ['best-seller', '3-pack', 'most-loved', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Multi']),
        averageRating: 4.6,
        reviewCount: 203,
      },
      {
        name: 'Boys Cargo Shorts',
        sku: 'BOY-SHRT-001',
        description: 'Durable cargo shorts with multiple pockets. Elastic waistband for easy dressing.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.boysShorts),
        tags: ['boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Khaki', 'Navy', 'Olive']),
        averageRating: 4.4,
        reviewCount: 78,
      },
      {
        name: 'Boys Fleece Hoodie',
        sku: 'BOY-HOOD-001',
        description: 'Super soft fleece hoodie with kangaroo pocket. Perfect for layering on chilly days.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 32.95,
        costPrice: 19.77,
        imageUrls: makeImageUrls(IMG.boysHoodie),
        tags: ['back-to-school', 'most-loved', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Gray', 'Blue', 'Black']),
        averageRating: 4.8,
        reviewCount: 156,
      },
      {
        name: 'Boys Swim Trunks',
        sku: 'BOY-SWIM-001',
        description: 'Quick-dry swim trunks with UPF 50+ protection. Fun prints for beach and pool days.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 18.95,
        costPrice: 11.37,
        imageUrls: makeImageUrls(IMG.boysSwimwear),
        tags: ['sale', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Blue Waves', 'Green Tropical']),
        averageRating: 4.2,
        reviewCount: 45,
      },

      // ─── GIRLS ─────────────────────────────────────────────────────────
      {
        name: 'Girls Floral Sundress',
        sku: 'GRL-DRSS-001',
        description: 'Beautiful floral print sundress with twirl-worthy skirt. Soft cotton with adjustable straps.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 32.95,
        costPrice: 19.77,
        imageUrls: makeImageUrls(IMG.girlsDress),
        tags: ['best-seller', 'most-loved', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Pink Floral', 'Blue Floral', 'Yellow Floral']),
        averageRating: 4.9,
        reviewCount: 234,
      },
      {
        name: 'Girls Pleated Skirt',
        sku: 'GRL-SKRT-001',
        description: 'Classic pleated skirt with elastic waistband. Pairs perfectly with any top.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.girlsSkirt),
        tags: ['back-to-school', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Navy', 'Plaid', 'Khaki']),
        averageRating: 4.5,
        reviewCount: 89,
      },
      {
        name: 'Girls Ruffle Sleeve Top',
        sku: 'GRL-TOP-001',
        description: 'Adorable ruffle sleeve blouse with delicate embroidery detail. Perfect for school or play.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 19.95,
        costPrice: 11.97,
        imageUrls: makeImageUrls(IMG.girlsTop),
        tags: ['back-to-school', 'best-seller', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['White', 'Lavender', 'Peach']),
        averageRating: 4.6,
        reviewCount: 112,
      },
      {
        name: 'Girls Knit Cardigan',
        sku: 'GRL-CARD-001',
        description: 'Soft knit cardigan with pearl buttons. A versatile layering piece for all seasons.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 29.95,
        costPrice: 17.97,
        imageUrls: makeImageUrls(IMG.girlsCardigan),
        tags: ['most-loved', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Cream', 'Dusty Pink', 'Sage']),
        averageRating: 4.7,
        reviewCount: 98,
      },
      {
        name: 'Girls Leggings 3-Pack',
        sku: 'GRL-LEG-001',
        description: 'Super stretchy leggings in a 3-pack of everyday colors. Soft cotton-spandex blend.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 18.95,
        costPrice: 11.37,
        imageUrls: makeImageUrls(IMG.girlsLeggings),
        tags: ['best-seller', '3-pack', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Black/Navy/Gray']),
        averageRating: 4.8,
        reviewCount: 312,
      },
      {
        name: 'Girls Wool Blend Coat',
        sku: 'GRL-COAT-001',
        description: 'Elegant wool blend coat with decorative buttons. Fully lined for extra warmth.',
        categoryId: catMap['Girls'],
        policyId: policies[1]._id,
        basePrice: 59.95,
        costPrice: 35.97,
        imageUrls: makeImageUrls(IMG.girlsCoat),
        tags: ['top-rated', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Camel', 'Red', 'Navy']),
        averageRating: 4.9,
        reviewCount: 67,
      },
      {
        name: 'Girls Romper with Bow',
        sku: 'GRL-ROMP-001',
        description: 'Sweet romper with bow detail at the waist. Easy snap buttons for quick changes.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 26.95,
        costPrice: 16.17,
        imageUrls: makeImageUrls(IMG.girlsRomper),
        tags: ['most-loved', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Coral', 'Mint', 'White']),
        averageRating: 4.5,
        reviewCount: 73,
      },

      // ─── BABY ──────────────────────────────────────────────────────────
      {
        name: 'Baby Cotton Bodysuit 5-Pack',
        sku: 'BAB-BODY-001',
        description: 'Essential bodysuits in soft 100% organic cotton. Expandable shoulders and snap closure.',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.babyOnesie),
        tags: ['best-seller', 'most-loved', 'baby'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['White', 'Pastel Mix']),
        averageRating: 4.9,
        reviewCount: 456,
      },
      {
        name: 'Baby Romper with Feet',
        sku: 'BAB-ROMP-001',
        description: 'Cozy footed romper in super-soft cotton. Full zip for easy diaper changes.',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 16.95,
        costPrice: 10.17,
        imageUrls: makeImageUrls(IMG.babyRomper),
        tags: ['best-seller', 'baby'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Blue Stars', 'Pink Hearts', 'Gray Stripe']),
        averageRating: 4.8,
        reviewCount: 189,
      },
      {
        name: 'Baby Girl Party Dress',
        sku: 'BAB-DRSS-001',
        description: 'Adorable tulle skirt dress with satin bodice. Perfect for birthdays and special occasions.',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 34.95,
        costPrice: 20.97,
        imageUrls: makeImageUrls(IMG.babyDress),
        tags: ['top-rated', 'baby', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Ivory', 'Blush Pink', 'Lavender']),
        averageRating: 4.9,
        reviewCount: 145,
      },
      {
        name: 'Baby Sleep & Play Pajamas',
        sku: 'BAB-SLPR-001',
        description: 'Flame-resistant sleeper in soft cotton. Adorable animal prints. Snap closure.',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 14.95,
        costPrice: 8.97,
        imageUrls: makeImageUrls(IMG.babySleeper),
        tags: ['most-loved', 'baby'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Safari Print', 'Ocean Friends', 'Woodland']),
        averageRating: 4.7,
        reviewCount: 267,
      },
      {
        name: 'Baby 3-Piece Outfit Set',
        sku: 'BAB-SET-001',
        description: 'Complete outfit set with bodysuit, pants, and bib. Coordinated prints in soft cotton.',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 24.95,
        costPrice: 14.97,
        imageUrls: makeImageUrls(IMG.babySet),
        tags: ['best-seller', '3-pack', 'baby'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Bear Theme', 'Star Theme', 'Dino Theme']),
        averageRating: 4.6,
        reviewCount: 198,
      },
      {
        name: 'Baby Muslin Swaddle Blanket Set',
        sku: 'BAB-SWAD-001',
        description: 'Ultra-soft muslin swaddle blankets. Breathable and gentle on baby\'s skin. Set of 3.',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 29.95,
        costPrice: 17.97,
        imageUrls: makeImageUrls(IMG.babySwaddle),
        tags: ['top-rated', 'baby', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Floral', 'Animals', 'Stars']),
        averageRating: 4.9,
        reviewCount: 312,
      },

      // ─── TODDLER ──────────────────────────────────────────────────────
      {
        name: 'Toddler Denim Dungarees',
        sku: 'TOD-DUNG-001',
        description: 'Cute denim overalls with adjustable straps. Snap leg openings for easy dressing.',
        categoryId: catMap['Toddler'],
        policyId: policies[0]._id,
        basePrice: 28.95,
        costPrice: 17.37,
        imageUrls: makeImageUrls(IMG.toddlerDungarees),
        tags: ['best-seller', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.toddler, ['Classic Blue', 'Light Wash']),
        averageRating: 4.7,
        reviewCount: 134,
      },
      {
        name: 'Toddler Girl Tutu Dress',
        sku: 'TOD-TUTU-001',
        description: 'Sparkly tutu dress with glitter bodice. Every little girl\'s dream outfit!',
        categoryId: catMap['Toddler'],
        policyId: policies[0]._id,
        basePrice: 32.95,
        costPrice: 19.77,
        imageUrls: makeImageUrls(IMG.toddlerDress),
        tags: ['top-rated', 'most-loved', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.toddler, ['Pink Sparkle', 'Silver', 'Gold']),
        averageRating: 4.9,
        reviewCount: 178,
      },
      {
        name: 'Toddler Matching Set',
        sku: 'TOD-SET-001',
        description: 'Adorable top and bottom matching set. Easy pull-on style for independent dressers.',
        categoryId: catMap['Toddler'],
        policyId: policies[0]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.toddlerSet),
        tags: ['back-to-school', 'best-seller'],
        status: 'active',
        variants: makeVariants(SIZES.toddler, ['Stripe/Solid', 'Floral/Denim']),
        averageRating: 4.5,
        reviewCount: 92,
      },

      // ─── SHOES ─────────────────────────────────────────────────────────
      {
        name: 'Kids Light-Up Sneakers',
        sku: 'SHO-SNKR-001',
        description: 'Fun light-up sneakers with velcro straps. LED lights in the sole that flash with every step!',
        categoryId: catMap['Shoes'],
        policyId: policies[2]._id,
        basePrice: 34.95,
        costPrice: 20.97,
        imageUrls: makeImageUrls(IMG.kidsSneakers),
        tags: ['best-seller', 'most-loved', 'back-to-school'],
        status: 'active',
        variants: makeVariants(SIZES.shoes_kids, ['Blue/White', 'Pink/Silver', 'Black/Red']),
        averageRating: 4.6,
        reviewCount: 234,
      },
      {
        name: 'Kids Summer Sandals',
        sku: 'SHO-SAND-001',
        description: 'Comfortable open-toe sandals with arch support. Non-slip rubber sole. Adjustable straps.',
        categoryId: catMap['Shoes'],
        policyId: policies[2]._id,
        basePrice: 24.95,
        costPrice: 14.97,
        imageUrls: makeImageUrls(IMG.kidsSandals),
        tags: ['sale'],
        status: 'active',
        variants: makeVariants(SIZES.shoes_kids, ['Tan', 'Navy', 'Pink']),
        averageRating: 4.3,
        reviewCount: 67,
      },
      {
        name: 'Kids Waterproof Rain Boots',
        sku: 'SHO-BOOT-001',
        description: 'Bright and fun rain boots with easy pull-on handles. 100% waterproof. Removable insoles.',
        categoryId: catMap['Shoes'],
        policyId: policies[2]._id,
        basePrice: 29.95,
        costPrice: 17.97,
        imageUrls: makeImageUrls(IMG.kidsBoots),
        tags: ['top-rated'],
        status: 'active',
        variants: makeVariants(SIZES.shoes_kids, ['Yellow', 'Red', 'Blue Shark']),
        averageRating: 4.8,
        reviewCount: 89,
      },

      // ─── ACCESSORIES ───────────────────────────────────────────────────
      {
        name: 'Kids Adventure Backpack',
        sku: 'ACC-BKPK-001',
        description: 'Durable kids backpack with padded straps. Multiple compartments for school supplies.',
        categoryId: catMap['Accessories'],
        policyId: policies[2]._id,
        basePrice: 29.95,
        costPrice: 17.97,
        imageUrls: makeImageUrls(IMG.kidsBackpack),
        tags: ['back-to-school', 'best-seller'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Dinosaur', 'Unicorn', 'Space']),
        averageRating: 4.7,
        reviewCount: 156,
      },
      {
        name: 'Kids Bucket Hat',
        sku: 'ACC-HAT-001',
        description: 'Sun-protective bucket hat with UPF 50+. Adjustable chin strap. Fun patterns.',
        categoryId: catMap['Accessories'],
        policyId: policies[2]._id,
        basePrice: 14.95,
        costPrice: 8.97,
        imageUrls: makeImageUrls(IMG.kidsHat),
        tags: ['sale', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Safari', 'Floral', 'Nautical']),
        averageRating: 4.4,
        reviewCount: 78,
      },
      {
        name: 'Kids Polarized Sunglasses',
        sku: 'ACC-SUN-001',
        description: 'Flexible frame polarized sunglasses. 100% UV protection. Comes with carrying case.',
        categoryId: catMap['Accessories'],
        policyId: policies[2]._id,
        basePrice: 16.95,
        costPrice: 10.17,
        imageUrls: makeImageUrls(IMG.kidsSunglasses),
        tags: ['sale'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Blue', 'Pink', 'Black']),
        averageRating: 4.5,
        reviewCount: 45,
      },

      // ─── PAJAMAS ───────────────────────────────────────────────────────
      {
        name: 'Boys Dinosaur Pajama Set',
        sku: 'PJ-BOY-001',
        description: 'Glow-in-the-dark dinosaur print pajama set. Snug-fit for safety. Soft 100% cotton.',
        categoryId: catMap['Pajamas'],
        policyId: policies[0]._id,
        basePrice: 19.95,
        costPrice: 11.97,
        imageUrls: makeImageUrls(IMG.pajamasBoys),
        tags: ['best-seller', 'most-loved', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Blue Dino', 'Green Dino']),
        averageRating: 4.8,
        reviewCount: 189,
      },
      {
        name: 'Girls Unicorn Pajama Set',
        sku: 'PJ-GRL-001',
        description: 'Magical unicorn print pajama set in super-soft cotton. Snug-fit with elastic waistband.',
        categoryId: catMap['Pajamas'],
        policyId: policies[0]._id,
        basePrice: 19.95,
        costPrice: 11.97,
        imageUrls: makeImageUrls(IMG.girlsPajamas),
        tags: ['best-seller', 'most-loved', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Purple Unicorn', 'Pink Unicorn']),
        averageRating: 4.9,
        reviewCount: 234,
      },
      {
        name: 'Baby Footed Sleeper 2-Pack',
        sku: 'PJ-BAB-001',
        description: 'Cozy footed sleepers with zip front. Fold-over cuffs to protect tiny hands. 2-pack value.',
        categoryId: catMap['Pajamas'],
        policyId: policies[0]._id,
        basePrice: 18.95,
        costPrice: 11.37,
        imageUrls: makeImageUrls(IMG.babySleeper),
        tags: ['best-seller', 'baby'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Cloud Print', 'Animal Print']),
        averageRating: 4.7,
        reviewCount: 167,
      },

      // ─── BACK TO SCHOOL ────────────────────────────────────────────────
      {
        name: 'Classic Pique Polo Shirt (White)',
        sku: 'BTS-POLO-001',
        description: 'Classic white pique polo in stain-resistant fabric. Machine washable. Easy care.',
        categoryId: catMap['Back to School'],
        policyId: policies[0]._id,
        basePrice: 14.95,
        costPrice: 8.97,
        imageUrls: makeImageUrls(IMG.boysPolo),
        tags: ['back-to-school', 'best-seller'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['White']),
        averageRating: 4.4,
        reviewCount: 312,
      },
      {
        name: 'Khaki School Pants',
        sku: 'BTS-PANT-001',
        description: 'Wrinkle-resistant school pants with stain protection. Reinforced knees.',
        categoryId: catMap['Back to School'],
        policyId: policies[0]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.boysJeans),
        tags: ['back-to-school'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Khaki', 'Navy']),
        averageRating: 4.5,
        reviewCount: 156,
      },
      {
        name: 'Girls School Jumper Dress',
        sku: 'BTS-JUMP-001',
        description: 'Classic plaid jumper dress for school. Pleated skirt with adjustable shoulder straps.',
        categoryId: catMap['Back to School'],
        policyId: policies[0]._id,
        basePrice: 26.95,
        costPrice: 16.17,
        imageUrls: makeImageUrls(IMG.girlsSkirt),
        tags: ['back-to-school', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Navy Plaid', 'Gray Plaid']),
        averageRating: 4.6,
        reviewCount: 89,
      },
      {
        name: 'Kids Lunch Box & Water Bottle Set',
        sku: 'BTS-LNCH-001',
        description: 'Insulated lunch box with matching water bottle. BPA-free. Fun designs kids love.',
        categoryId: catMap['Back to School'],
        policyId: policies[2]._id,
        basePrice: 24.95,
        costPrice: 14.97,
        imageUrls: makeImageUrls(IMG.kidsBackpack),
        tags: ['back-to-school', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Rocket Ship', 'Rainbow', 'Safari']),
        averageRating: 4.7,
        reviewCount: 198,
      },

      // ─── KIDS COSTUMES & DRESS-UP ──────────────────────────────────────
      {
        name: 'Kids Superhero Cape & Mask Set',
        sku: 'CST-HERO-001',
        description: 'Vibrant reversible superhero cape with matching mask. Perfect for active imaginative play, parties and dress-up.',
        categoryId: catMap['Costumes'],
        policyId: policies[0]._id,
        basePrice: 18.95,
        costPrice: 11.37,
        imageUrls: makeImageUrls(IMG.kidsCostume),
        tags: ['costumes', 'best-seller', 'play'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Red/Blue', 'Black/Gold', 'Green/Yellow']),
        averageRating: 4.8,
        reviewCount: 145,
      },
      {
        name: 'Magical Princess Fairytale Gown',
        sku: 'CST-PRNC-001',
        description: 'Enchanting fairytale princess gown with sparkling tulle skirt, embroidered bodice and soft satin lining.',
        categoryId: catMap['Costumes'],
        policyId: policies[0]._id,
        basePrice: 32.95,
        costPrice: 19.77,
        imageUrls: makeImageUrls(IMG.kidsCostume),
        tags: ['costumes', 'most-loved', 'dresses', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Gold/Pink', 'Royal Blue']),
        averageRating: 4.9,
        reviewCount: 112,
      },
      {
        name: 'Little Astronaut Explorer Suit',
        sku: 'CST-ASTRO-001',
        description: 'Complete junior astronaut jumpsuit with mission badges, elastic cuffs and mock zipper pockets.',
        categoryId: catMap['Costumes'],
        policyId: policies[0]._id,
        basePrice: 28.95,
        costPrice: 17.37,
        imageUrls: makeImageUrls(IMG.kidsCostume),
        tags: ['costumes', 'top-rated', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.toddler.concat(SIZES.kids.slice(0, 3)), ['White/Silver']),
        averageRating: 4.7,
        reviewCount: 67,
      },
      {
        name: 'Baby Little Crown Onesie & Cape Set',
        sku: 'CST-BABY-001',
        description: 'Ultra-soft 100% cotton royal baby onesie with detachable soft velvet cape and matching headband crown.',
        categoryId: catMap['Costumes'],
        policyId: policies[0]._id,
        basePrice: 16.95,
        costPrice: 10.17,
        imageUrls: makeImageUrls(IMG.babyOnesie),
        tags: ['costumes', 'baby', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Royal Navy', 'Ruby Red']),
        averageRating: 4.9,
        reviewCount: 234,
      },
      {
        name: 'Safari Wildlife Explorer Costume Set',
        sku: 'CST-SFRI-001',
        description: 'Breathable cotton khaki vest, shorts, explorer hat and play magnifying glass for curious young minds.',
        categoryId: catMap['Costumes'],
        policyId: policies[0]._id,
        basePrice: 26.95,
        costPrice: 16.17,
        imageUrls: makeImageUrls(IMG.kidsCostume),
        tags: ['costumes', 'sets', 'unisex'],
        status: 'active',
        variants: makeVariants(SIZES.kids.slice(0, 3), ['Khaki/Olive']),
        averageRating: 4.8,
        reviewCount: 98,
      },
      {
        name: 'Festive Butterfly Wings & Tutu Set',
        sku: 'CST-BTFL-001',
        description: 'Glittering rainbow butterfly wings with matching layered tulle tutu and star wand for hours of dress-up fun.',
        categoryId: catMap['Costumes'],
        policyId: policies[0]._id,
        basePrice: 21.95,
        costPrice: 13.17,
        imageUrls: makeImageUrls(IMG.kidsCostume),
        tags: ['costumes', 'sale', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Rainbow', 'Lavender/Silver']),
        averageRating: 4.6,
        reviewCount: 156,
      },

      // ─── SALE ──────────────────────────────────────────────────────────
      {
        name: 'Boys Basic Tee 5-Pack',
        sku: 'SAL-BTEE-001',
        description: 'Everyday basic tees in assorted colors. Soft cotton, tag-free comfort. Amazing value!',
        categoryId: catMap['Sale'],
        policyId: policies[0]._id,
        basePrice: 14.95,
        costPrice: 8.97,
        imageUrls: makeImageUrls(IMG.boysTshirt),
        tags: ['sale', 'best-seller', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Assorted']),
        averageRating: 4.6,
        reviewCount: 456,
      },
      {
        name: 'Girls Cotton Dress (Clearance)',
        sku: 'SAL-GDRSS-001',
        description: 'Beautiful cotton dress at an unbeatable price. Limited stock clearance item.',
        categoryId: catMap['Sale'],
        policyId: policies[0]._id,
        basePrice: 12.95,
        costPrice: 7.77,
        imageUrls: makeImageUrls(IMG.girlsDress),
        tags: ['sale', 'girl'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Coral', 'Sky Blue']),
        averageRating: 4.3,
        reviewCount: 67,
      },
      {
        name: 'Baby Bodysuits 7-Pack (Clearance)',
        sku: 'SAL-BBODY-001',
        description: 'One for every day of the week! Soft cotton bodysuits in assorted pastel colors.',
        categoryId: catMap['Sale'],
        policyId: policies[0]._id,
        basePrice: 16.95,
        costPrice: 10.17,
        imageUrls: makeImageUrls(IMG.babyOnesie),
        tags: ['sale', 'baby', 'best-seller'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Pastel Mix']),
        averageRating: 4.7,
        reviewCount: 289,
      },

      // ─── EXTRA PRODUCTS ────────────────────────────────────────────────
      {
        name: 'Boys Chino Pants',
        sku: 'BOY-CHIN-001',
        description: 'Smart chino pants in stretch cotton twill. Adjustable waistband for the perfect fit.',
        categoryId: catMap['Boys'],
        policyId: policies[0]._id,
        basePrice: 26.95,
        costPrice: 16.17,
        imageUrls: makeImageUrls(IMG.boysJeans),
        tags: ['back-to-school', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Khaki', 'Navy', 'Gray']),
        averageRating: 4.5,
        reviewCount: 98,
      },
      {
        name: 'Girls Denim Jacket',
        sku: 'GRL-DNJK-001',
        description: 'Classic denim jacket with embroidered flower details. A wardrobe staple for layering.',
        categoryId: catMap['Girls'],
        policyId: policies[0]._id,
        basePrice: 39.95,
        costPrice: 23.97,
        imageUrls: makeImageUrls(IMG.girlsCoat),
        tags: ['most-loved', 'girl', 'back-to-school'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['Medium Wash', 'Light Wash']),
        averageRating: 4.7,
        reviewCount: 112,
      },
      {
        name: 'Baby Boy Gentleman Outfit Set',
        sku: 'BAB-GENT-001',
        description: 'Adorable gentleman outfit with bow tie bodysuit and suspender pants. Photo-ready!',
        categoryId: catMap['Baby'],
        policyId: policies[0]._id,
        basePrice: 28.95,
        costPrice: 17.37,
        imageUrls: makeImageUrls(IMG.babySet),
        tags: ['top-rated', 'baby', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.baby, ['Navy/White', 'Gray/White']),
        averageRating: 4.8,
        reviewCount: 145,
      },
      {
        name: 'Toddler Rain Jacket',
        sku: 'TOD-RAIN-001',
        description: 'Colorful waterproof rain jacket with reflective strips. Hood with snap closure.',
        categoryId: catMap['Toddler'],
        policyId: policies[1]._id,
        basePrice: 32.95,
        costPrice: 19.77,
        imageUrls: makeImageUrls(IMG.boysJacket),
        tags: ['most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.toddler, ['Yellow', 'Red', 'Blue']),
        averageRating: 4.6,
        reviewCount: 87,
      },
      {
        name: 'Girls Ballet Flats',
        sku: 'SHO-BLLT-001',
        description: 'Sparkly ballet flats with elastic strap. Non-slip sole. Perfect for dress-up occasions.',
        categoryId: catMap['Shoes'],
        policyId: policies[2]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.kidsSandals),
        tags: ['girl', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.shoes_kids, ['Gold Glitter', 'Silver', 'Black Patent']),
        averageRating: 4.5,
        reviewCount: 78,
      },
      {
        name: 'Kids Beanie & Scarf Set',
        sku: 'ACC-BEAN-001',
        description: 'Warm knit beanie with matching scarf. Soft fleece lining. Fun pom-pom details.',
        categoryId: catMap['Accessories'],
        policyId: policies[2]._id,
        basePrice: 18.95,
        costPrice: 11.37,
        imageUrls: makeImageUrls(IMG.kidsHat),
        tags: ['sale', 'most-loved'],
        status: 'active',
        variants: makeVariants(SIZES.onesize, ['Red', 'Pink', 'Blue']),
        averageRating: 4.6,
        reviewCount: 56,
      },
      {
        name: 'Family Matching Pajamas Set',
        sku: 'PJ-FAM-001',
        description: 'Adorable matching family pajamas in plaid print. Available in baby through adult sizes.',
        categoryId: catMap['Pajamas'],
        policyId: policies[0]._id,
        basePrice: 24.95,
        costPrice: 14.97,
        imageUrls: makeImageUrls(IMG.pajamasGirls),
        tags: ['most-loved', 'best-seller'],
        status: 'active',
        variants: makeVariants(SIZES.baby.concat(SIZES.toddler).concat(SIZES.kids), ['Red Plaid']),
        averageRating: 4.9,
        reviewCount: 345,
      },
      {
        name: 'Boys Button-Down Oxford Shirt',
        sku: 'BTS-OXFD-001',
        description: 'Classic oxford button-down in easy-care cotton. Perfect for school photos and events.',
        categoryId: catMap['Back to School'],
        policyId: policies[0]._id,
        basePrice: 22.95,
        costPrice: 13.77,
        imageUrls: makeImageUrls(IMG.boysPolo),
        tags: ['back-to-school', 'boy'],
        status: 'active',
        variants: makeVariants(SIZES.kids, ['White', 'Light Blue', 'Pink']),
        averageRating: 4.5,
        reviewCount: 123,
      },
    ];

    // Add SEO and publishedAt to all products
    const enrichedProducts = productData.map(p => ({
      ...p,
      seo: {
        title: p.name,
        description: p.description.substring(0, 160),
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      },
      images: [{
        cloudinaryPublicId: p.sku.toLowerCase(),
        altText: p.name,
        isFeatured: true,
        order: 1,
        uploadedAt: new Date(),
      }],
      publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
    }));

    const createdProducts = await Product.insertMany(enrichedProducts);
    console.log(`Seeded ${createdProducts.length} products`);

    // ── Seed Sample Orders ───────────────────────────────────────────────────
    const orders: any[] = [];
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const payStatuses = ['Paid', 'Paid', 'Paid', 'Unpaid'];

    for (let i = 0; i < 30; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items: any[] = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const price = product.basePrice;
        subtotal += price * quantity;

        items.push({
          productId: product._id,
          name: product.name,
          price,
          quantity,
          sku: product.sku,
        });
      }

      const shippingFee = subtotal >= 30 ? 0 : 5.95;
      const tax = Math.round(subtotal * 0.08 * 100) / 100;
      const totalAmount = Math.round((subtotal + shippingFee + tax) * 100) / 100;

      orders.push({
        orderNumber: `ORD-${String(10000 + i).padStart(5, '0')}`,
        customer: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: `${100 + i} Main Street`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
          country: 'United States',
          zipCode: String(10001 + Math.floor(Math.random() * 89999)),
        },
        items,
        subtotal,
        shippingFee,
        tax,
        totalAmount,
        paymentMethod: Math.random() > 0.3 ? 'paystack' : 'cash_on_delivery',
        paystackReference: `ref_${Date.now()}_${i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentStatus: payStatuses[Math.floor(Math.random() * payStatuses.length)],
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      });
    }

    const createdOrders = await Order.insertMany(orders);
    console.log(`Seeded ${createdOrders.length} orders`);

    // ── Seed Audit Logs ──────────────────────────────────────────────────────
    const auditLogs: any[] = [];
    const actions = ['USER_LOGIN', 'ORDER_CREATED', 'PRODUCT_UPDATED', 'COUPON_APPLIED'];
    for (let i = 0; i < 20; i++) {
      auditLogs.push({
        action: actions[Math.floor(Math.random() * actions.length)],
        user: users[Math.floor(Math.random() * users.length)]._id,
        details: {
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0',
          description: `${actions[Math.floor(Math.random() * actions.length)]} action performed`,
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }
    await AuditLog.insertMany(auditLogs);
    console.log(`Seeded ${auditLogs.length} audit logs`);

    console.log('\n✅ Database seeded successfully with real product data!');
    console.log(`   📦 ${createdProducts.length} products`);
    console.log(`   📁 ${categories.length} categories`);
    console.log(`   👤 ${users.length} users`);
    console.log(`   🎟️  ${coupons.length} coupons`);
    console.log(`   📋 ${createdOrders.length} orders`);
    console.log(`\n   Demo login: demo@jasmarkids.com / password123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
