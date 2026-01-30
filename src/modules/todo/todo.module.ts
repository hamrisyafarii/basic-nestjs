import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';

@Module({
  providers: [TodoService, TodoRepository],
  controllers: [TodoController],
  exports: [TodoService],
})
export class TodoModule {}
