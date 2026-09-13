import { Model } from 'mongoose';
import { Chat } from './chat.schema';
export declare class ChatService {
    private chatModel;
    constructor(chatModel: Model<Chat>);
    saveMessage(sessionId: string, sender: 'customer' | 'admin', message: string, type?: string, customerName?: string, customerEmail?: string): Promise<import("mongoose").Document<unknown, {}, Chat, {}, import("mongoose").DefaultSchemaOptions> & Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMessagesBySession(sessionId: string): Promise<(import("mongoose").Document<unknown, {}, Chat, {}, import("mongoose").DefaultSchemaOptions> & Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getAllSessions(): Promise<any[]>;
    getAnalytics(): Promise<{
        totalMessages: number;
        trendingKeywords: {
            word: string;
            count: number;
        }[];
    }>;
}
