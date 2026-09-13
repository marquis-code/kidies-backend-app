import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getAllSessions(): Promise<any[]>;
    getAnalytics(): Promise<{
        totalMessages: number;
        trendingKeywords: {
            word: string;
            count: number;
        }[];
    }>;
    getMessagesBySession(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./chat.schema").Chat, {}, import("mongoose").DefaultSchemaOptions> & import("./chat.schema").Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
