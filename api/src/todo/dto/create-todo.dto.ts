import { IsString, IsBoolean } from 'class-validator';

export class CreateTodoDto {
  @IsString({ message: 'Title must be a string' })
  title: string;
  @IsBoolean({ message: 'Completed must be a boolean' })
  completed: boolean;
  @IsString({ message: 'Description must be a string' })
  description: string;
}
