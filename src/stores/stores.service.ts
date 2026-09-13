import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './schemas/store.schema';

@Injectable()
export class StoresService implements OnModuleInit {
  constructor(@InjectModel(Store.name) private storeModel: Model<StoreDocument>) {}

  async onModuleInit() {
    const count = await this.storeModel.countDocuments();
    if (count === 0) {
      console.log('Seeding dummy stores...');
      await this.storeModel.insertMany([
        {
          name: 'JasmarKids Lekki',
          address: 'Admiralty Way, Lekki Phase 1',
          city: 'Lagos',
          state: 'Lagos',
          zip: '106104',
          phone: '+234 800 123 4567',
          location: { type: 'Point', coordinates: [3.4688, 6.4474] } // longitude, latitude
        },
        {
          name: 'JasmarKids Ikeja City Mall',
          address: 'Obafemi Awolowo Way',
          city: 'Ikeja',
          state: 'Lagos',
          zip: '100271',
          phone: '+234 800 987 6543',
          location: { type: 'Point', coordinates: [3.3565, 6.6139] } // longitude, latitude
        }
      ]);
    }
  }

  async searchStores(query: any) {
    const { lat, lng, distance, q } = query;
    let filter: any = {};

    if (lat && lng) {
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)], // longitude, latitude
          },
          $maxDistance: distance ? parseInt(distance) * 1609.34 : 25 * 1609.34, // distance in miles -> meters
        },
      };
    } else if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { zip: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
      ];
    } else {
      // Return default if no query
      return this.storeModel.find().limit(10).exec();
    }

    return this.storeModel.find(filter).limit(20).exec();
  }
}
