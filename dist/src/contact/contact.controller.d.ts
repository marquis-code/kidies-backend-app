import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/contact.schema").Contact, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/contact.schema").Contact & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/contact.schema").Contact, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/contact.schema").Contact & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
