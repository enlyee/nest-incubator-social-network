import configuration from './settings/configuration';

import { EmailConfirmationConstraint } from './common/decorators/validate/email.confirmation.decorator';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './features/users/application/users.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query.repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query.repository';
import { AuthService } from './features/auth/application/auth.service';
import { LoginIsExistConstraint } from './common/decorators/validate/login.registration.decorator';
import { EmailIsExistConstraint } from './common/decorators/validate/email.registration.decorator';
import { EmailConfirmationResendingConstraint } from './common/decorators/validate/email.confirmation.resending.decorator';
import { EmailConfirmationRepository } from './features/auth/infrastructure/email.confirmation.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query.repository';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './common/strategies/jwt.strategy';
import { BasicStrategy } from './common/strategies/basic.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './features/auth/constants';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersController } from './features/users/api/users.controller';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { PostsController } from './features/posts/api/posts.controller';
import { CommentsController } from './features/comments/api/comments.controller';
import { TestingGodController } from './features/testing/testing.god.controller';
import { AuthController } from './features/auth/api/auth.controller';
import { MailService } from './common/mailer/api/mailer';
import { TryAuthMiddleware } from './common/middlewares/try.auth.middleware';
import { CommentsService } from './features/comments/application/comments.service';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsLikesQueryRepository } from './features/likes/infrostructure/comments-likes.query.repository';
import { CommentsLikesRepository } from './features/likes/infrostructure/comments-likes.repository';
import { CommentsLikesService } from './features/likes/application/comments-likes.service';
import { BlogIsExistConstraint } from './common/decorators/validate/blogId.decorator';
import { IsLikeStatusConstraint } from './common/decorators/validate/like.status.decorator';
import { PostsLikesQueryRepository } from './features/likes/infrostructure/posts-likes.query.repository';
import { PostsLikesService } from './features/likes/application/posts-likes.service';
import { PostsLikesRepository } from './features/likes/infrostructure/posts-likes.repository';
import { ThrottlerModule } from '@nestjs/throttler';
import { SessionService } from './features/security/application/session.service';
import { SessionRepository } from './features/security/infrastructure/session.repository';
import { SecurityController } from './features/security/api/security.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BlogsControllerSa } from './features/blogs/api/blogs.sa.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

const decorators: Provider[] = [BlogIsExistConstraint, IsLikeStatusConstraint];

const usersProviders: Provider[] = [
  UsersService,
  UsersRepository,
  UsersQueryRepository,
];

const sessionsProvideres: Provider[] = [SessionService, SessionRepository];

const blogsProviders: Provider[] = [
  BlogsService,
  BlogsRepository,
  BlogsQueryRepository,
];

const postsProviders: Provider[] = [
  PostsService,
  PostsRepository,
  PostsQueryRepository,
];

const authProviders: Provider[] = [
  AuthService,
  LoginIsExistConstraint,
  EmailIsExistConstraint,
  EmailConfirmationConstraint,
  EmailConfirmationResendingConstraint,
  EmailConfirmationRepository,
];

const commentsProviders: Provider[] = [
  CommentsService,
  CommentsRepository,
  CommentsController,
  CommentsQueryRepository,
];

const likesProviders: Provider[] = [
  CommentsLikesQueryRepository,
  CommentsLikesRepository,
  CommentsLikesService,
  PostsLikesQueryRepository,
  PostsLikesService,
  PostsLikesRepository,
];

const strategies: Provider[] = [
  AccessTokenStrategy,
  RefreshTokenStrategy,
  BasicStrategy,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 500000000, //5
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('typeOrmConfig'),
      inject: [ConfigService],
    }),

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('jwtConfig'),
      inject: [ConfigService],
    }),

    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('mailerConfig'),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    TestingGodController,
    AuthController,
    SecurityController,
    BlogsControllerSa,
  ],
  providers: [
    ...decorators,
    ...authProviders,
    ...strategies,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...likesProviders,
    ...sessionsProvideres,
    MailService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TryAuthMiddleware)
      .forRoutes(
        { path: 'posts/:id/comments', method: RequestMethod.GET },
        { path: 'comments/:id', method: RequestMethod.GET },
        { path: 'posts/:id', method: RequestMethod.GET },
        { path: 'posts', method: RequestMethod.GET },
        { path: 'blogs/:id/posts', method: RequestMethod.GET },
      );
  }
}
