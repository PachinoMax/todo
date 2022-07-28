import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateTodoDto } from 'src/todo/dto/create-todo.dto';
import { disconnect, Types } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const testDto: CreateTodoDto = {
  title: 'test',
  completed: false,
  description: 'test description',
};

const logintDto: AuthDto = {
  email: 'test@gmail.com',
  password: '12345',
};

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let createdTodoId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(logintDto);
    token = body.accessToken;
  });

  it('/todo/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/todo/create')
      .set('Authorization', `Bearer ${token}`)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdTodoId = body._id;
        expect(createdTodoId).toBeDefined();
      });
  });

  it('/todo/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/todo/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...testDto, title: 123 })
      .expect(400)
      .then(({ body }: request.Response) => {
        expect(body.message).toStrictEqual(['Title must be a string']);
      });
  });

  it('/todo (GET)', async () => {
    return request(app.getHttpServer())
      .get('/todo')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/todo/:id (GET) - success', () => {
    return request(app.getHttpServer())
      .get(`/todo/${createdTodoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/todo/:id (PATCH) - success', () => {
    return request(app.getHttpServer())
      .patch(`/todo/${createdTodoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'test2' })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toBeDefined();
      });
  });

  it('/todo/:id (PATCH) - fail', () => {
    return request(app.getHttpServer())
      .patch(`/todo/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'test2' })
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toStrictEqual({});
      });
  });

  it('/todo/:id (GET) - fail', () => {
    return request(app.getHttpServer())
      .get(`/todo/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body).toStrictEqual({});
      });
  });

  it('/todo/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete(`/todo/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        message: 'Todo not found',
        statusCode: 404,
      });
  });

  it('/todo/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/todo/${createdTodoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(() => {
    disconnect();
  });
});
