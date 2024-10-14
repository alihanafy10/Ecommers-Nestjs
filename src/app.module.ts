import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env']
    }),
    MongooseModule.forRoot(process.env.MONGOOSE_URI),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
