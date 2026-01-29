import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TodoRepository } from './todo.repository';

@Module({
  providers: [TodoService, TodoRepository],
  controllers: [TodoController],
  exports: [TodoService],
  imports: [DatabaseModule],
})
export class TodoModule {}
