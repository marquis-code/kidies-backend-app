import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
export declare class StoresService implements OnModuleInit {
    private storeModel;
    constructor(storeModel: Model<StoreDocument>);
    onModuleInit(): Promise<void>;
    searchStores(query: any): Promise<(import("mongoose").Document<unknown, {}, StoreDocument, {}, import("mongoose").DefaultSchemaOptions> & Store & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
