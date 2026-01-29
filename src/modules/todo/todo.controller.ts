import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos(@Query() queryTodo: GetTodoDto) {
    return this.todoService.getAllTodos(queryTodo);
  }

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Patch(':id')
  updateTodo(
    @Param('id') todoId: number,
    @Body() updateTodoBody: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(todoId, updateTodoBody);
  }

  @Delete(':id')
  deleteTodo(@Param('id') todoId: number) {
    return this.todoService.deleteTodo(todoId);
  }
}
