import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async saveInventory(
    @Body('userId') userId: string,
    @Body('fileName') fileName: string,
    @Body('data') data: any[],
  ) {
    const result = await this.inventoryService.saveInventory(userId, fileName, data);
    return { success: true, inventory: result };
  }

  @Get(':userId')
  async getInventory(@Param('userId') userId: string) {
    const result = await this.inventoryService.getInventory(userId);
    return { success: !!result, inventory: result };
  }
}
