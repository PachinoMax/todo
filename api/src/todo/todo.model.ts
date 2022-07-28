import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
export interface TodoModel extends Base {}
export class TodoModel extends TimeStamps {
  @prop()
  title: string;
  @prop()
  completed: boolean;
  @prop()
  description: string;
}
