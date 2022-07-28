import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoModel } from './todo.model';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(TodoModel) private readonly todoModel: ModelType<TodoModel>,
  ) {}
  async create(dto: CreateTodoDto): Promise<DocumentType<TodoModel>> {
    return await this.todoModel.create(dto);
  }
  async findAll(): Promise<DocumentType<TodoModel>[]> {
    return await this.todoModel.find().exec();
  }
  async findOne(id: string): Promise<DocumentType<TodoModel>> {
    return await this.todoModel.findById(id).exec();
  }
  async update(
    id: string,
    dto: CreateTodoDto,
  ): Promise<DocumentType<TodoModel>> {
    return await this.todoModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }
  async delete(id: string): Promise<DocumentType<TodoModel> | null> {
    return await this.todoModel.findByIdAndDelete(id).exec();
  }
}
