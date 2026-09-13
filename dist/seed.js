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
const ProductSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    category: String,
    basePrice: Number,
    imageUrls: {
        main: String,
        thumbnails: [String],
    },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Product = mongoose_1.default.model('Product', ProductSchema);
const seedData = [
    {
        name: 'Organic Cotton Onesie',
        slug: 'organic-cotton-onesie',
        description: 'Ultra-soft organic cotton onesie perfect for everyday wear.',
        category: 'baby',
        basePrice: 34.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1522771930-78848d92871d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Knit Sweater Set',
        slug: 'knit-sweater-set',
        description: 'Cozy two-piece knit set for chilly days.',
        category: 'toddler',
        basePrice: 65.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1519278409-1f56fc0e0db7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Linen Summer Dress',
        slug: 'linen-summer-dress',
        description: 'Lightweight linen dress for summer outings.',
        category: 'toddler',
        basePrice: 48.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Classic Denim Overalls',
        slug: 'classic-denim-overalls',
        description: 'Durable denim overalls for playtime.',
        category: 'toddler',
        basePrice: 55.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Merino Wool Beanie',
        slug: 'merino-wool-beanie',
        description: 'Warm merino wool beanie for sensitive skin.',
        category: 'accessories',
        basePrice: 28.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1576722880193-271d491c36df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Fleece Lined Booties',
        slug: 'fleece-lined-booties',
        description: 'Keep little toes warm with these fleece-lined booties.',
        category: 'baby',
        basePrice: 42.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1596870230751-eb104e14f861?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Ribbed Cotton Leggings',
        slug: 'ribbed-cotton-leggings',
        description: 'Stretchy, comfortable leggings in earthy tones.',
        category: 'baby',
        basePrice: 24.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1577908972825-f76159516cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    },
    {
        name: 'Formal Blazer & Trousers',
        slug: 'formal-blazer-trousers',
        description: 'Sharp formal wear for special occasions.',
        category: 'toddler',
        basePrice: 110.00,
        imageUrls: {
            main: 'https://images.unsplash.com/photo-1560215033-049fa02edec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            thumbnails: []
        }
    }
];
async function seed() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        await Product.deleteMany({});
        console.log('Cleared existing products');
        const dataWithSku = seedData.map((p, index) => ({
            ...p,
            sku: `JAS-${String(index + 1).padStart(4, '0')}`
        }));
        await Product.insertMany(dataWithSku);
        console.log(`Seeded ${dataWithSku.length} products successfully`);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map