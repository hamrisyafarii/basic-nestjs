import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
