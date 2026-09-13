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
const product_schema_1 = require("./src/products/schemas/product.schema");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:adminpassword@localhost:27017/jasmarkids?authSource=admin';
const Product = mongoose_1.default.model('Product', product_schema_1.ProductSchema);
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
        await mongoose_1.default.connect(MONGODB_URI);
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
    }
    catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
}
updateProductImages();
//# sourceMappingURL=update-images.js.map