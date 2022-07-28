import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  email: 'test123@gmail.com',
  password: '12345',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(loginDto)
      .expect(201);
  });

  it('/auth/register (POST) - fail not email send', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...loginDto, email: 'test' })
      .expect(400, {
        statusCode: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        token = body.accessToken;
        expect(token).toBeDefined();
      });
  });

  it('/auth/login (POST) - fail wrong password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '123' })
      .expect(401, {
        statusCode: 401,
        message: 'Wrong password',
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail wrong email', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, email: 'tes@gmail.com' })
      .expect(401, {
        statusCode: 401,
        message: 'User with this email does not exist',
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
