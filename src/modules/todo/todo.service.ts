import { BadRequestException, Injectable } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { TodoResponseEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllTodos(
    getQueryTodo: GetTodoDto,
  ): Promise<ApiResponse<TodoResponseEntity[]>> {
    if (getQueryTodo.overdue) {
      const todos = await this.todoRepository.findOverdueTodo();

      return {
        message: 'Success with overdue',
        data: todos,
      };
    }

    const todos = await this.todoRepository.findAll();

    return {
      message: 'Success',
      data: todos,
    };
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
  ): Promise<ApiResponse<TodoResponseEntity>> {
    const todo = await this.todoRepository.create(createTodoDto);

    return {
      message: 'Success create new Todo',
      data: todo,
    };
  }

  async updateTodo(
    todoId: number,
    updateTodoBody: UpdateTodoDto,
  ): Promise<ApiResponse<TodoResponseEntity>> {
    const todoExists = await this.todoRepository.findById(todoId);

    if (!todoExists) {
      throw new BadRequestException('Todo dose not exists');
    }

    const updatedTodo = await this.todoRepository.updateById(
      todoId,
      updateTodoBody,
    );

    return {
      message: 'Data todo updated',
      data: updatedTodo,
    };
  }

  async deleteTodo(todoId: number): Promise<ApiResponse<null>> {
    const todoExists = await this.todoRepository.findById(todoId);

    if (!todoExists) {
      throw new BadRequestException('Todo dose not exists');
    }

    await this.todoRepository.delete(todoId);

    return {
      message: `todo ${todoExists.label} deleted`,
      data: null,
    };
  }
}
