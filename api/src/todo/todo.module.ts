import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TodoController } from './todo.controller';
import { TodoModel } from './todo.model';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TodoModel,
        schemaOptions: {
          collection: 'Todo',
        },
      },
    ]),
  ],
  providers: [TodoService],
})
export class TodoModule {}
