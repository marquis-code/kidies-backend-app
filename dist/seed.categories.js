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
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin';
const CategorySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });
const Category = mongoose_1.default.model('Category', CategorySchema);
const seedCategories = [
    { name: 'baby', description: 'Clothing and accessories for babies (0-24 months)' },
    { name: 'toddler', description: 'Clothing for toddlers (2-5 years)' },
    { name: 'accessories', description: 'Hats, socks, bibs, and other accessories' },
    { name: 'shoes', description: 'Footwear for babies and toddlers' },
    { name: 'gifts', description: 'Gift sets and special occasions' },
];
async function seed() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB for categories');
        for (const cat of seedCategories) {
            await Category.updateOne({ name: cat.name }, { $set: cat }, { upsert: true });
        }
        console.log(`Seeded categories successfully`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.categories.js.map