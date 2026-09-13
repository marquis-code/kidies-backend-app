import { Controller, Get, Query } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('search')
  async search(@Query() query: any) {
    return this.storesService.searchStores(query);
  }
}
