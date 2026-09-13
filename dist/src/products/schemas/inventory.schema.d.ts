import { Document, Types } from 'mongoose';
export type InventoryDocument = Inventory & Document;
export declare class Inventory {
    productId: Types.ObjectId;
    variantId: Types.ObjectId;
    warehouseId: string;
    quantityAvailable: number;
    quantityReserved: number;
    reorderLevel: number;
    lastCountedAt: Date;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, any, any, Inventory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, Inventory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    variantId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    warehouseId?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantityAvailable?: import("mongoose").SchemaDefinitionProperty<number, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    quantityReserved?: import("mongoose").SchemaDefinitionProperty<number, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    reorderLevel?: import("mongoose").SchemaDefinitionProperty<number, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lastCountedAt?: import("mongoose").SchemaDefinitionProperty<Date, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Inventory>;
