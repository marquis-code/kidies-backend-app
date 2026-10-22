import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
