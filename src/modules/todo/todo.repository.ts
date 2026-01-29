import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class TodoRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const todos = await this.databaseService.todo.findMany();

    return todos;
  }

  async findOverdueTodo() {
    return await this.databaseService.todo.findMany({
      where: {
        dueDate: {
          lt: new Date(),
        },
      },
    });
  }

  async findById(todoId: number) {
    return await this.databaseService.todo.findUnique({
      where: {
        id: todoId,
      },
    });
  }

  async create(createTodoDto: CreateTodoDto) {
    return await this.databaseService.todo.create({
      data: createTodoDto,
    });
  }

  async updateById(todoId: number, updateTodoDto: UpdateTodoDto) {
    const dataToUpdate: Prisma.TodoUpdateInput = {};

    if (updateTodoDto.label) {
      dataToUpdate.label = updateTodoDto.label;
    }

    if (updateTodoDto.dueDate) {
      dataToUpdate.dueDate = updateTodoDto.dueDate;
    }

    return await this.databaseService.todo.update({
      where: {
        id: todoId,
      },
      data: updateTodoDto,
    });
  }

  async delete(todoId: number) {
    return await this.databaseService.todo.delete({
      where: {
        id: todoId,
      },
    });
  }
}
