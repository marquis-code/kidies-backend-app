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
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const user_schema_1 = require("./src/auth/schemas/user.schema");
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jasmarkids';
const User = mongoose_1.default.model('User', user_schema_1.UserSchema);
async function createAdmin() {
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        const email = 'admin@jasmarkids.com';
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.findOne({ email });
        if (user) {
            console.log('Admin user found, resetting password...');
            await User.updateOne({ _id: user._id }, { $set: { passwordHash, role: 'admin' } });
            console.log('Admin password reset successfully to: ' + password);
        }
        else {
            console.log('Admin user not found, creating new...');
            const newAdmin = new User({
                email,
                firstName: 'Admin',
                lastName: 'User',
                passwordHash,
                role: 'admin'
            });
            await User.collection.insertOne({
                email,
                firstName: 'Admin',
                lastName: 'User',
                passwordHash,
                role: 'admin',
                isEmailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Admin user created successfully with password: ' + password);
        }
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map