import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './schemas/contact.schema';
export declare class ContactService {
    private readonly contactModel;
    constructor(contactModel: Model<Contact>);
    create(createContactDto: CreateContactDto): Promise<import("mongoose").Document<unknown, {}, Contact, {}, import("mongoose").DefaultSchemaOptions> & Contact & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Contact, {}, import("mongoose").DefaultSchemaOptions> & Contact & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
