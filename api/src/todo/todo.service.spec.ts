import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  const exec = { exec: jest.fn() };

  const todoRepositoryFactory = () => ({
    findById: () => exec,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          useFactory: todoRepositoryFactory,
          provide: getModelToken('TodoModel'),
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should findOne working', async () => {
    const id = new Types.ObjectId().toHexString();
    todoRepositoryFactory()
      .findById()
      .exec.mockReturnValueOnce([{ _id: id }]);
    const result = await service.findOne(id);
    expect(result[0]._id).toBe(id);
  });
});
