"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contact_schema_1 = require("./schemas/contact.schema");
let ContactService = class ContactService {
    contactModel;
    constructor(contactModel) {
        this.contactModel = contactModel;
    }
    async create(createContactDto) {
        const payload = createContactDto || {};
        const required = ['firstName', 'lastName', 'email', 'message'];
        const missing = required.filter((key) => !payload[key] || !String(payload[key]).trim());
        if (missing.length) {
            throw new common_1.BadRequestException(`Missing contact details: ${missing.join(', ')}`);
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
            throw new common_1.BadRequestException('A valid email address is required');
        }
        const createdContact = new this.contactModel({
            ...payload,
            firstName: String(payload.firstName).trim(),
            lastName: String(payload.lastName).trim(),
            email: String(payload.email).toLowerCase().trim(),
            message: String(payload.message).trim(),
        });
        return createdContact.save();
    }
    async findAll() {
        return this.contactModel.find().sort({ createdAt: -1 }).exec();
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_schema_1.Contact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContactService);
//# sourceMappingURL=contact.service.js.map