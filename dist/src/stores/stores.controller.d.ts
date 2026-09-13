import { StoresService } from './stores.service';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    search(query: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/store.schema").StoreDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/store.schema").Store & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
