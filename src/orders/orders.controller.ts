import { Controller, Get, Post, Body, Param, UseGuards, Patch, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('track')
  async trackOrder(@Body() body: { email: string; orderNumber: string }) {
    const order = await this.ordersService.trackOrder(body.email, body.orderNumber);
    if (!order) {
      // Return 404 naturally or null
      return null;
    }
    return order;
  }

  @UseGuards(JwtGuard)
  @Get()
  async getOrders() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req: any) {
    const email = req.user?.email;
    return this.ordersService.findByEmail(email);
  }

  @UseGuards(JwtGuard)
  @Get('analytics')
  async getAnalytics() {
    return this.ordersService.getAnalytics();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
