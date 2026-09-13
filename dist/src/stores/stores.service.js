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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const store_schema_1 = require("./schemas/store.schema");
let StoresService = class StoresService {
    storeModel;
    constructor(storeModel) {
        this.storeModel = storeModel;
    }
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
                    location: { type: 'Point', coordinates: [3.4688, 6.4474] }
                },
                {
                    name: 'JasmarKids Ikeja City Mall',
                    address: 'Obafemi Awolowo Way',
                    city: 'Ikeja',
                    state: 'Lagos',
                    zip: '100271',
                    phone: '+234 800 987 6543',
                    location: { type: 'Point', coordinates: [3.3565, 6.6139] }
                }
            ]);
        }
    }
    async searchStores(query) {
        const { lat, lng, distance, q } = query;
        let filter = {};
        if (lat && lng) {
            filter.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)],
                    },
                    $maxDistance: distance ? parseInt(distance) * 1609.34 : 25 * 1609.34,
                },
            };
        }
        else if (q) {
            filter.$or = [
                { name: new RegExp(q, 'i') },
                { zip: new RegExp(q, 'i') },
                { city: new RegExp(q, 'i') },
            ];
        }
        else {
            return this.storeModel.find().limit(10).exec();
        }
        return this.storeModel.find(filter).limit(20).exec();
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(store_schema_1.Store.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StoresService);
//# sourceMappingURL=stores.service.js.map