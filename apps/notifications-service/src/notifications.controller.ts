import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notification.service';

@Controller("notifications")
export class NotificationsController {

  constructor(private readonly service: NotificationsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
