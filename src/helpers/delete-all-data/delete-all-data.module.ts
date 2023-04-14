import { Module } from '@nestjs/common';
import { AllDataController } from './delete-all-data.controller';
import { AllDataService } from './delete-all-data.service';
import { PrismaModule } from '../../database/prisma.module';
import { FilesModule } from '../../adapters/files/files.module';

@Module({
  controllers: [AllDataController],
  imports: [PrismaModule, FilesModule],
  providers: [AllDataService],
})
export class AllDataModule {}
