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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreSchema = exports.Store = exports.GeoLocation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
class GeoLocation {
    type;
    coordinates;
}
exports.GeoLocation = GeoLocation;
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['Point'], default: 'Point', required: true }),
    __metadata("design:type", String)
], GeoLocation.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number], required: true }),
    __metadata("design:type", Array)
], GeoLocation.prototype, "coordinates", void 0);
let Store = class Store {
    name;
    address;
    city;
    state;
    zip;
    phone;
    location;
};
exports.Store = Store;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Store.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Store.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Store.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Store.prototype, "zip", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Store.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: GeoLocation, required: true, index: '2dsphere' }),
    __metadata("design:type", GeoLocation)
], Store.prototype, "location", void 0);
exports.Store = Store = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Store);
exports.StoreSchema = mongoose_1.SchemaFactory.createForClass(Store);
//# sourceMappingURL=store.schema.js.map