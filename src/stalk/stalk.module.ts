import { Module } from '@nestjs/common';
import { StalkService } from './api/Services';
import StalkServiceImpl from './internal/application/StalkServiceImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StalkCounterEntity, StalkEntity } from './internal/domain/Entities';

@Module({
  imports: [TypeOrmModule.forFeature([StalkEntity, StalkCounterEntity])],
  providers: [
    {
      provide: StalkService,
      useClass: StalkServiceImpl,
    },
  ],
  exports: [StalkService],
})
export class StalkModule {}
