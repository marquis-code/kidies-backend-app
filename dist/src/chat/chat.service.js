"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./chat.schema");
let ChatService = class ChatService {
    chatModel;
    constructor(chatModel) {
        this.chatModel = chatModel;
    }
    async saveMessage(sessionId, sender, message, type = 'text', customerName, customerEmail) {
        const newMessage = new this.chatModel({
            sessionId,
            sender,
            message,
            type,
            customerName,
            customerEmail,
        });
        return newMessage.save();
    }
    async getMessagesBySession(sessionId) {
        return this.chatModel.find({ sessionId }).sort({ createdAt: 1 }).exec();
    }
    async getAllSessions() {
        return this.chatModel.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$sessionId',
                    lastMessage: { $first: '$message' },
                    lastMessageTime: { $first: '$createdAt' },
                    customerName: { $max: '$customerName' },
                    customerEmail: { $max: '$customerEmail' },
                },
            },
            { $sort: { lastMessageTime: -1 } },
        ]).exec();
    }
    async getAnalytics() {
        const chats = await this.chatModel.find({ sender: 'customer' }).exec();
        const keywords = {};
        const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'for', 'to', 'in', 'of', 'with', 'what', 'how', 'when', 'why', 'can', 'i', 'you', 'my', 'have', 'are', 'that', 'this', 'do'];
        chats.forEach(chat => {
            if (!chat.message)
                return;
            const words = chat.message.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
            words.forEach(word => {
                if (word.length > 3 && !stopWords.includes(word)) {
                    keywords[word] = (keywords[word] || 0) + 1;
                }
            });
        });
        const trendingKeywords = Object.entries(keywords)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => Number(b.count) - Number(a.count))
            .slice(0, 8);
        if (trendingKeywords.length === 0) {
            return {
                totalMessages: 0,
                trendingKeywords: [
                    { word: 'onesie', count: 12 },
                    { word: 'delivery', count: 9 },
                    { word: 'discount', count: 7 },
                    { word: 'size', count: 6 },
                    { word: 'shipping', count: 5 }
                ]
            };
        }
        return {
            totalMessages: chats.length,
            trendingKeywords
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map