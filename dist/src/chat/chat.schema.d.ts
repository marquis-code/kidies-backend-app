import { Document } from 'mongoose';
export declare class Chat extends Document {
    sessionId: string;
    sender: 'customer' | 'admin';
    message: string;
    type: string;
    attachment?: string;
    customerName?: string;
    customerEmail?: string;
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, any, any, Chat>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, Chat, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sessionId?: import("mongoose").SchemaDefinitionProperty<string, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    sender?: import("mongoose").SchemaDefinitionProperty<"customer" | "admin", Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    attachment?: import("mongoose").SchemaDefinitionProperty<string | undefined, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    customerEmail?: import("mongoose").SchemaDefinitionProperty<string | undefined, Chat, Document<unknown, {}, Chat, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Chat & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Chat>;
