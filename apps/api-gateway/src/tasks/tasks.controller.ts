import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { TasksService } from './tasks.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Helpers
  private getUserId(req: any) {
    return req.user?.sub ?? req.user?.id ?? null;
  }

  // -------------------
  // GET /tasks?page=1&size=10
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() q: PaginationDto) {
    return this.tasksService.findAll({
      page: Number(q.page ?? 1),
      size: Number(q.size ?? 10),
    });
  }

  // -------------------
  // POST /tasks
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateTaskDto) {
    const createdBy = this.getUserId(req);
    return this.tasksService.create({ ...dto, createdBy });
  }

  // -------------------
  // GET /tasks/:id
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  // -------------------
  // PUT /tasks/:id
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const updatedBy = this.getUserId(req);
    return this.tasksService.update(id, { ...dto, updatedBy });
  }

  // -------------------
  // DELETE /tasks/:id
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  // -------------------
  // POST /tasks/:id/comments
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  addComment(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AddCommentDto,
  ) {
    const authorId = this.getUserId(req);
    return this.tasksService.addComment(id, { ...dto, authorId });
  }

  // -------------------
  // GET /tasks/:id/comments
  // -------------------
  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  listComments(@Param('id') id: string, @Query() q: PaginationDto) {
    return this.tasksService.listComments(id, {
      page: Number(q.page ?? 1),
      size: Number(q.size ?? 10),
    });
  }
}
