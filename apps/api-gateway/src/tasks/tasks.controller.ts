import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE')
    private readonly tasksClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    return this.tasksClient.send('tasks.findAll', {
      page: Number(page),
      size: Number(size),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: any) {
    return this.tasksClient.send('tasks.create', dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.tasksClient.send('tasks.findOne', { id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: any,
  ) {
    return this.tasksClient.send('tasks.update', { id: Number(id), dto });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.tasksClient.send('tasks.remove', { id: Number(id) });
  }

  // Comments -------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') id: number,
    @Body() dto: any,
  ) {
    return this.tasksClient.send('tasks.addComment', {
      taskId: Number(id),
      dto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  async listComments(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    return this.tasksClient.send('tasks.listComments', {
      taskId: Number(id),
      page: Number(page),
      size: Number(size),
    });
  }
}
