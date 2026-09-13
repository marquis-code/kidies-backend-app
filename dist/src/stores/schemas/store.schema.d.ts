import { Document } from 'mongoose';
export type StoreDocument = Store & Document;
export declare class GeoLocation {
    type: string;
    coordinates: number[];
}
export declare class Store {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    location: GeoLocation;
}
export declare const StoreSchema: import("mongoose").Schema<Store, import("mongoose").Model<Store, any, any, any, any, any, Store>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Store, Document<unknown, {}, Store, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    city?: import("mongoose").SchemaDefinitionProperty<string, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    zip?: import("mongoose").SchemaDefinitionProperty<string, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<GeoLocation, Store, Document<unknown, {}, Store, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Store & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Store>;
