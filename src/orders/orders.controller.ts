import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('track')
  async trackOrder(@Body() body: { email: string; orderNumber: string }) {
    return this.ordersService.trackOrder(body.email, body.orderNumber);
  }

  @Post('verify-payment')
  async verifyPayment(@Body() body: { orderNumber: string; reference?: string }) {
    return this.ordersService.verifyPayment(body.orderNumber, body.reference);
  }

  @Get('lookup/:orderNumber')
  async lookupOrder(
    @Param('orderNumber') orderNumber: string,
    @Query('email') email?: string,
    @Query('reference') reference?: string,
  ) {
    return this.ordersService.findByOrderNumber(orderNumber, email, reference);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get()
  async getOrders(@Query() query: any) {
    return this.ordersService.findAll(query);
  }

  @UseGuards(JwtGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req: any) {
    return this.ordersService.findByEmail(req.user?.email);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('analytics')
  async getAnalytics() {
    return this.ordersService.getAnalytics();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getOrderById(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findById(id, req.user);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    return this.ordersService.updateStatus(id, status, req.user);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/cancel')
  async cancelOrder(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.cancelByCustomer(id, req.user);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch(':id/payment')
  async updatePaymentStatus(@Param('id') id: string, @Body('paymentStatus') paymentStatus: string) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }
}
