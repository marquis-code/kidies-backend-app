"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const faker_1 = require("@faker-js/faker");
const bcrypt = __importStar(require("bcrypt"));
const category_schema_1 = require("./src/categories/schemas/category.schema");
const product_schema_1 = require("./src/products/schemas/product.schema");
const order_schema_1 = require("./src/orders/schemas/order.schema");
const product_policy_schema_1 = require("./src/product-policies/schemas/product-policy.schema");
const coupon_schema_1 = require("./src/coupons/coupon.schema");
const audit_log_schema_1 = require("./src/audit-logs/schemas/audit-log.schema");
const user_schema_1 = require("./src/auth/schemas/user.schema");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin';
const Category = mongoose_1.default.model('Category', category_schema_1.CategorySchema);
const Product = mongoose_1.default.model('Product', product_schema_1.ProductSchema);
const Order = mongoose_1.default.model('Order', order_schema_1.OrderSchema);
const ProductPolicy = mongoose_1.default.model('ProductPolicy', product_policy_schema_1.ProductPolicySchema);
const Coupon = mongoose_1.default.model('Coupon', coupon_schema_1.CouponSchema);
const AuditLog = mongoose_1.default.model('AuditLog', audit_log_schema_1.AuditLogSchema);
const User = mongoose_1.default.model('User', user_schema_1.UserSchema);
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        try {
            await mongoose_1.default.connection.db.collection('categories').drop();
        }
        catch (e) { }
        try {
            await mongoose_1.default.connection.db.collection('products').drop();
        }
        catch (e) { }
        try {
            await mongoose_1.default.connection.db.collection('orders').drop();
        }
        catch (e) { }
        try {
            await mongoose_1.default.connection.db.collection('productpolicies').drop();
        }
        catch (e) { }
        try {
            await mongoose_1.default.connection.db.collection('coupons').drop();
        }
        catch (e) { }
        try {
            await mongoose_1.default.connection.db.collection('auditlogs').drop();
        }
        catch (e) { }
        await User.deleteMany({ email: { $ne: 'admin@jasmarkids.com' } });
        await Category.init();
        await Product.init();
        await Order.init();
        await ProductPolicy.init();
        await Coupon.init();
        await AuditLog.init();
        console.log('Cleared existing data and indexes');
        const policies = [];
        for (let i = 0; i < 5; i++) {
            policies.push({
                name: faker_1.faker.commerce.department() + ' Policy',
                productDetails: faker_1.faker.lorem.paragraph(),
                shippingAndReturns: faker_1.faker.lorem.paragraph(),
            });
        }
        const createdPolicies = await ProductPolicy.insertMany(policies);
        console.log(`Seeded ${createdPolicies.length} policies`);
        const categories = [];
        const categoryNames = ['Boys', 'Girls', 'Toddlers', 'Babies', 'Accessories', 'Shoes', 'Toys', 'Sale', 'New Arrivals', 'Winter Collection'];
        for (const name of categoryNames) {
            categories.push({
                name,
                description: faker_1.faker.lorem.sentence(),
                status: 'active',
            });
        }
        const createdCategories = await Category.insertMany(categories);
        console.log(`Seeded ${createdCategories.length} categories`);
        const users = [];
        const passwordHash = await bcrypt.hash('password123', 10);
        for (let i = 0; i < 50; i++) {
            users.push({
                firstName: faker_1.faker.person.firstName(),
                lastName: faker_1.faker.person.lastName(),
                email: faker_1.faker.internet.email(),
                passwordHash,
            });
        }
        const createdUsers = await User.insertMany(users);
        console.log(`Seeded ${createdUsers.length} users`);
        const coupons = [];
        for (let i = 0; i < 20; i++) {
            coupons.push({
                code: faker_1.faker.string.alphanumeric({ length: 8, casing: 'upper' }),
                discountType: faker_1.faker.helpers.arrayElement(['percentage', 'fixed']),
                discountValue: faker_1.faker.number.int({ min: 5, max: 50 }),
                isActive: faker_1.faker.datatype.boolean(),
                expiryDate: faker_1.faker.date.future(),
            });
        }
        const createdCoupons = await Coupon.insertMany(coupons);
        console.log(`Seeded ${createdCoupons.length} coupons`);
        const products = [];
        for (let i = 0; i < 150; i++) {
            const category = faker_1.faker.helpers.arrayElement(createdCategories);
            const policy = faker_1.faker.helpers.arrayElement(createdPolicies);
            const basePrice = faker_1.faker.number.int({ min: 10, max: 200 });
            products.push({
                name: faker_1.faker.commerce.productName(),
                sku: faker_1.faker.string.alphanumeric({ length: 8, casing: 'upper' }),
                description: faker_1.faker.commerce.productDescription(),
                categoryId: category._id,
                policyId: policy._id,
                basePrice,
                costPrice: basePrice * 0.6,
                images: [
                    {
                        cloudinaryPublicId: 'sample',
                        altText: faker_1.faker.lorem.words(2),
                        isFeatured: true,
                        order: 1,
                        uploadedAt: new Date(),
                    }
                ],
                imageUrls: {
                    thumbnail: faker_1.faker.image.url({ width: 150, height: 150 }),
                    medium: faker_1.faker.image.url({ width: 400, height: 400 }),
                    large: faker_1.faker.image.url({ width: 800, height: 800 }),
                    original: faker_1.faker.image.url(),
                },
                tags: [faker_1.faker.commerce.productAdjective(), faker_1.faker.commerce.productAdjective()],
                status: faker_1.faker.helpers.arrayElement(['active', 'active', 'active', 'draft', 'archived']),
                seo: {
                    title: faker_1.faker.commerce.productName(),
                    description: faker_1.faker.lorem.sentence(),
                    slug: faker_1.faker.lorem.slug(),
                },
                publishedAt: faker_1.faker.date.past(),
                variants: [
                    {
                        size: faker_1.faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                        color: faker_1.faker.color.human(),
                        sku: faker_1.faker.string.alphanumeric(8),
                        stockQuantity: faker_1.faker.number.int({ min: 0, max: 100 }),
                    }
                ]
            });
        }
        const createdProducts = await Product.insertMany(products);
        console.log(`Seeded ${createdProducts.length} products`);
        const orders = [];
        for (let i = 0; i < 200; i++) {
            const user = faker_1.faker.helpers.arrayElement(createdUsers);
            const numItems = faker_1.faker.number.int({ min: 1, max: 5 });
            const items = [];
            let subtotal = 0;
            for (let j = 0; j < numItems; j++) {
                const product = faker_1.faker.helpers.arrayElement(createdProducts);
                const quantity = faker_1.faker.number.int({ min: 1, max: 3 });
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
            const shippingFee = faker_1.faker.number.int({ min: 5, max: 20 });
            const tax = subtotal * 0.1;
            const totalAmount = subtotal + shippingFee + tax;
            orders.push({
                orderNumber: `ORD-${faker_1.faker.string.numeric(6)}`,
                customer: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    address: faker_1.faker.location.streetAddress(),
                    city: faker_1.faker.location.city(),
                    country: faker_1.faker.location.country(),
                    zipCode: faker_1.faker.location.zipCode(),
                },
                items,
                subtotal,
                shippingFee,
                tax,
                totalAmount,
                paymentMethod: faker_1.faker.helpers.arrayElement(['paystack', 'cash_on_delivery']),
                paystackReference: faker_1.faker.string.alphanumeric(10),
                status: faker_1.faker.helpers.arrayElement(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
                paymentStatus: faker_1.faker.helpers.arrayElement(['Unpaid', 'Paid', 'Refunded']),
                createdAt: faker_1.faker.date.recent({ days: 60 }),
            });
        }
        const createdOrders = await Order.insertMany(orders);
        console.log(`Seeded ${createdOrders.length} orders`);
        const auditLogs = [];
        for (let i = 0; i < 100; i++) {
            auditLogs.push({
                action: faker_1.faker.helpers.arrayElement(['USER_LOGIN', 'ORDER_CREATED', 'PRODUCT_UPDATED', 'COUPON_APPLIED', 'SETTINGS_CHANGED']),
                user: faker_1.faker.helpers.arrayElement(createdUsers)._id,
                details: {
                    ipAddress: faker_1.faker.internet.ip(),
                    userAgent: faker_1.faker.internet.userAgent(),
                    description: faker_1.faker.lorem.sentence(),
                },
                createdAt: faker_1.faker.date.recent({ days: 30 }),
            });
        }
        const createdLogs = await AuditLog.insertMany(auditLogs);
        console.log(`Seeded ${createdLogs.length} audit logs`);
        console.log('Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
//# sourceMappingURL=seed.all.js.map