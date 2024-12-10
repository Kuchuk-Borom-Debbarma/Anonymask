import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from './user/domain/User';
import UserField from './user/domain/UserField';
import UserFieldMap from './user/domain/UserFieldMap';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule } from './graphql/graphql.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConstantsEnvNames } from "./util/Constants";

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
          host: configService.get<string>('DB_HOST'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PWD'),
          database: configService.get<string>('DB_NAME'),
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [User, UserField, UserFieldMap],
        };
      },
    }),
    UserModule,
    GraphqlModule,
  ],
  controllers: [],
  providers :[]
  //providers: [PublicQueryResolver,PublicMutationResolver],
})
export class AppModule {}
