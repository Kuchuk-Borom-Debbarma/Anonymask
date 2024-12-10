import { Module } from '@nestjs/common';
import RootQueryResolver from './Queries/Root';

@Module({
  providers: [RootQueryResolver],
})
export class GraphqlModule {}
