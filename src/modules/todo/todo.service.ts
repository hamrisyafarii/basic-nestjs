import { BadRequestException, Injectable } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  getAllTodos(getQueryTodo: GetTodoDto) {
    if (getQueryTodo.overdue) {
      return this.todoRepository.findOverdueTodo();
    }

    return this.todoRepository.findAll();
  }

  createTodo(createTodoDto: CreateTodoDto) {
    return this.todoRepository.create(createTodoDto);
  }

  async updateTodo(todoId: number, updateTodoBody: UpdateTodoDto) {
    const todoExists = await this.todoRepository.findById(todoId);

    if (!todoExists) {
      throw new BadRequestException('Todo dose not exists');
    }

    return this.todoRepository.updateById(todoId, updateTodoBody);
  }

  async deleteTodo(todoId: number) {
    const todoExists = await this.todoRepository.findById(todoId);

    if (!todoExists) {
      throw new BadRequestException('Todo dose not exists');
    }

    return await this.todoRepository.delete(todoId);
  }
}
