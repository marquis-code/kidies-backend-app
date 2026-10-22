import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const payload: any = createContactDto || {};
    const required = ['firstName', 'lastName', 'email', 'message'];
    const missing = required.filter((key) => !payload[key] || !String(payload[key]).trim());
    if (missing.length) {
      throw new BadRequestException(`Missing contact details: ${missing.join(', ')}`);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
      throw new BadRequestException('A valid email address is required');
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
}
