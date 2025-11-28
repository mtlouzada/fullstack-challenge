import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Controller('tasks')
export class TasksHttpController {
  constructor(private readonly tasksService: TasksService) {}

  // LIST
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
  ) {
    return this.tasksService.findAll({
      page: Number(page),
      size: Number(size),
    });
  }

  // FIND ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  // CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  // UPDATE
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(Number(id), dto);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }

  // ADD COMMENT
  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.addComment(Number(id), dto);
  }

  // LIST COMMENTS
  @Get(':id/comments')
  async listComments(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('size') size = 10
  ) {
    return this.tasksService.listComments(Number(id), {
      page: Number(page),
      size: Number(size),
    });
  }
}
