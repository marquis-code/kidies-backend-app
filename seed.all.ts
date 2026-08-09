import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
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

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (drop collections to clear old indexes)
    try { await mongoose.connection.db!.collection('categories').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('products').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('orders').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('productpolicies').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('coupons').drop(); } catch (e) {}
    try { await mongoose.connection.db!.collection('auditlogs').drop(); } catch (e) {}
    await User.deleteMany({ email: { $ne: 'admin@jasmarkids.com' } }); // Keep admin user
    
    // Create new indexes for collections that were dropped
    await Category.init();
    await Product.init();
    await Order.init();
    await ProductPolicy.init();
    await Coupon.init();
    await AuditLog.init();
    
    console.log('Cleared existing data and indexes');

    // Seed Policies
    const policies = [];
    for (let i = 0; i < 5; i++) {
      policies.push({
        name: faker.commerce.department() + ' Policy',
        productDetails: faker.lorem.paragraph(),
        shippingAndReturns: faker.lorem.paragraph(),
      });
    }
    const createdPolicies = await ProductPolicy.insertMany(policies);
    console.log(`Seeded ${createdPolicies.length} policies`);

    // Seed Categories
    const categories = [];
    const categoryNames = ['Boys', 'Girls', 'Toddlers', 'Babies', 'Accessories', 'Shoes', 'Toys', 'Sale', 'New Arrivals', 'Winter Collection'];
    for (const name of categoryNames) {
      categories.push({
        name,
        description: faker.lorem.sentence(),
        status: 'active',
      });
    }
    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories`);

    // Seed Users
    const users = [];
    const passwordHash = await bcrypt.hash('password123', 10);
    for (let i = 0; i < 50; i++) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        passwordHash,
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`Seeded ${createdUsers.length} users`);

    // Seed Coupons
    const coupons = [];
    for (let i = 0; i < 20; i++) {
      coupons.push({
        code: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
        discountType: faker.helpers.arrayElement(['percentage', 'fixed']),
        discountValue: faker.number.int({ min: 5, max: 50 }),
        isActive: faker.datatype.boolean(),
        expiryDate: faker.date.future(),
      });
    }
    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`Seeded ${createdCoupons.length} coupons`);

    // Seed Products
    const products = [];
    for (let i = 0; i < 150; i++) {
      const category = faker.helpers.arrayElement(createdCategories);
      const policy = faker.helpers.arrayElement(createdPolicies);
      const basePrice = faker.number.int({ min: 10, max: 200 });

      products.push({
        name: faker.commerce.productName(),
        sku: faker.string.alphanumeric({ length: 8, casing: 'upper' }),
        description: faker.commerce.productDescription(),
        categoryId: category._id,
        policyId: policy._id,
        basePrice,
        costPrice: basePrice * 0.6,
        images: [
          {
            cloudinaryPublicId: 'sample',
            altText: faker.lorem.words(2),
            isFeatured: true,
            order: 1,
            uploadedAt: new Date(),
          }
        ],
        imageUrls: {
          thumbnail: faker.image.url({ width: 150, height: 150 }),
          medium: faker.image.url({ width: 400, height: 400 }),
          large: faker.image.url({ width: 800, height: 800 }),
          original: faker.image.url(),
        },
        tags: [faker.commerce.productAdjective(), faker.commerce.productAdjective()],
        status: faker.helpers.arrayElement(['active', 'active', 'active', 'draft', 'archived']),
        seo: {
          title: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          slug: faker.lorem.slug(),
        },
        publishedAt: faker.date.past(),
        variants: [
          {
            size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
            color: faker.color.human(),
            sku: faker.string.alphanumeric(8),
            stockQuantity: faker.number.int({ min: 0, max: 100 }),
          }
        ]
      });
    }
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);

    // Seed Orders
    const orders = [];
    for (let i = 0; i < 200; i++) {
      const user = faker.helpers.arrayElement(createdUsers);
      const numItems = faker.number.int({ min: 1, max: 5 });
      const items = [];
      let subtotal = 0;
      
      for (let j = 0; j < numItems; j++) {
        const product = faker.helpers.arrayElement(createdProducts);
        const quantity = faker.number.int({ min: 1, max: 3 });
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
      
      const shippingFee = faker.number.int({ min: 5, max: 20 });
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + shippingFee + tax;

      orders.push({
        orderNumber: `ORD-${faker.string.numeric(6)}`,
        customer: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          country: faker.location.country(),
          zipCode: faker.location.zipCode(),
        },
        items,
        subtotal,
        shippingFee,
        tax,
        totalAmount,
        paymentMethod: faker.helpers.arrayElement(['paystack', 'cash_on_delivery']),
        paystackReference: faker.string.alphanumeric(10),
        status: faker.helpers.arrayElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
        paymentStatus: faker.helpers.arrayElement(['Unpaid', 'Paid', 'Refunded']),
        createdAt: faker.date.recent({ days: 60 }),
      });
    }
    const createdOrders = await Order.insertMany(orders);
    console.log(`Seeded ${createdOrders.length} orders`);

    // Seed Audit Logs
    const auditLogs = [];
    for (let i = 0; i < 100; i++) {
      auditLogs.push({
        action: faker.helpers.arrayElement(['USER_LOGIN', 'ORDER_CREATED', 'PRODUCT_UPDATED', 'COUPON_APPLIED', 'SETTINGS_CHANGED']),
        user: faker.helpers.arrayElement(createdUsers)._id,
        details: {
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          description: faker.lorem.sentence(),
        },
        createdAt: faker.date.recent({ days: 30 }),
      });
    }
    const createdLogs = await AuditLog.insertMany(auditLogs);
    console.log(`Seeded ${createdLogs.length} audit logs`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
