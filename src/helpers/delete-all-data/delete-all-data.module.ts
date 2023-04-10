import { Module } from '@nestjs/common';
import { AllDataController } from './delete-all-data.controller';
import { AllDataService } from './delete-all-data.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  controllers: [AllDataController],
  imports: [PrismaModule],
  providers: [AllDataService],
})
export class AllDataModule {}
