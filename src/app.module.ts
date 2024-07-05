import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Profile } from './user/entities/profile.entity';
import { Post } from './user/entities/post.entity';
import { AuthMiddleware } from './middlewares/auth.middleware';


@Module({
  imports: [AuthModule, BookmarkModule, UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'spyder00',
      username: 'postgres',
      entities: [User, Profile, Post],
      database: 'nest-rest-api',
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({path:'*', method:RequestMethod.ALL})
  }
}
