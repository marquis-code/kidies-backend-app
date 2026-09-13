import { Injectable } from '@nestjs/common';
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
    const createdContact = new this.contactModel(createContactDto);
    return createdContact.save();
  }
}
