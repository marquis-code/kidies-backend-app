import { Document } from 'mongoose';
export type SubscriberDocument = Subscriber & Document;
export declare class Subscriber {
    email: string;
    isActive: boolean;
}
export declare const SubscriberSchema: import("mongoose").Schema<Subscriber, import("mongoose").Model<Subscriber, any, any, any, any, any, Subscriber>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscriber, Document<unknown, {}, Subscriber, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    email?: import("mongoose").SchemaDefinitionProperty<string, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Subscriber, Document<unknown, {}, Subscriber, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Subscriber & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Subscriber>;
