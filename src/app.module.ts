import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { AllDataModule } from './helpers/delete-all-data/delete-all-data.module';
import { UserModule } from './features/user/user.module';
import { FilesModule } from './adapters/files/files.module';
import { EventEmitterModule } from './adapters/eventEmitter/eventEmitter.module';
import { OauthModule } from './adapters/oauth/oauth.module';
import { PublicModule } from './features/public/public.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SuperAdminModule } from './features/superadmin/superadmin.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    /*ThrottlerModule.forRootAsync({
      useFactory: () => ({ ttl: 10, limit: 100 }),
    }),*/
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      playground: true,
    }),
    AllDataModule,
    AuthModule,
    PrismaModule,
    UserModule,
    PublicModule,
    FilesModule,
    EventEmitterModule,
    OauthModule,
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    /*{
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },*/
  ],
})
export class AppModule {}
