import { Module } from '@nestjs/common';
import { AuthModule } from '../user/auth/auth.module';
import RootQuery from './Schemas/RootQuery';

@Module({
  providers: [RootQuery],
  imports: [AuthModule],
})
export class GraphqlModule {}
