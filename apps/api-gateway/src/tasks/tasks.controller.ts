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

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() q: PaginationDto) {
    const page = Number(q.page || 1);
    const size = Number(q.size || 10);
    return this.tasksService.findAll(page, size);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() dto: CreateTaskDto) {
    // request.user should be populated by JwtAuthGuard (payload.sub or id)
    const createdBy = req.user?.sub ?? req.user?.id ?? null;
    return this.tasksService.create({ ...dto, createdBy });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const updatedBy = req.user?.sub ?? req.user?.id ?? null;
    return this.tasksService.update(Number(id), { ...dto, updatedBy });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  addComment(@Request() req, @Param('id') id: string, @Body() dto: AddCommentDto) {
    const authorId = req.user?.sub ?? req.user?.id ?? null;
    return this.tasksService.addComment(Number(id), { ...dto, authorId });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/comments')
  listComments(@Param('id') id: string, @Query() q: PaginationDto) {
    const page = Number(q.page || 1);
    const size = Number(q.size || 10);
    return this.tasksService.listComments(Number(id), page, size);
  }
}
