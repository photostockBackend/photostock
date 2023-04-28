import { Module } from '@nestjs/common';
import { PublicController } from './api/public.controller';

@Module({
  controllers: [PublicController],
})
export class PublicModule {}
