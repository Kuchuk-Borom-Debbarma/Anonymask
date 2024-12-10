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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      logger: {
        info(message?: any) {
          console.log(`GRAPHQL INFO : ${message}`);
        },
        error(message?: any) {
          console.log(`GRAPHQL ERROR : ${message}`);
        },
        warn(message?: any) {
          console.log(`GRAPHQL WARN : ${message}`);
        },
        debug(message?: any) {
          console.log(`GRAPHQL DEBUG : ${message}`);
        },
      },
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
  providers: [],
  //providers: [PublicQueryResolver,PublicMutationResolver],
})
export class AppModule {}
