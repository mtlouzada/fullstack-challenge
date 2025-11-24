import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from './dto/pagination.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Query() q: PaginationDto) {
    const page = Number(q.page || 1);
    const size = Number(q.size || 10);
    return this.tasksService.findAll({ page, size });
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.tasksService.addComment(+id, dto);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string, @Query() q: PaginationDto) {
    const page = Number(q.page || 1);
    const size = Number(q.size || 10);
    return this.tasksService.listComments(+id, { page, size });
  }
}
