import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from './user/domain/User';
import UserField from './user/domain/UserField';
import UserFieldMap from './user/domain/UserFieldMap';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule } from './graphql/graphql.module';
import { PublicQueryResolver } from './graphql/resolvers/queries/public/Resolvers';
import { PublicMutationResolver } from './graphql/resolvers/mutations/public/Resolvers';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
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
    CommonModule,
    GraphqlModule,
  ],
  controllers: [],
  providers: [PublicQueryResolver,PublicMutationResolver],
})
export class AppModule {}
