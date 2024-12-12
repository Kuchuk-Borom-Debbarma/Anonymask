import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from './user/domain/User';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule } from './graphql/graphql.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConstEnvNames } from './util/Constants';
import { PostModule } from './post/post.module';
import { StalkModule } from './stalk/stalk.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>(ConstEnvNames.DB_HOST),
          username: configService.get<string>(ConstEnvNames.DB_USERNAME),
          password: configService.get<string>(ConstEnvNames.DB_PWD),
          database: configService.get<string>(ConstEnvNames.DB_NAME),
          ssl: {
            rejectUnauthorized: true,
          },
          autoLoadEntities: true,
        };
      },
    }),
    UserModule,
    GraphqlModule,
    PostModule,
    StalkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
