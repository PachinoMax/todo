import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoModel } from './todo.model';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTodos() {
    return this.todoService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTodoById(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async createTodo(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTodo(@Param('id') id: string, @Body() dto: TodoModel) {
    return this.todoService.update(id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    const deletedDoc = await this.todoService.delete(id);
    if (!deletedDoc) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }
  }
}
