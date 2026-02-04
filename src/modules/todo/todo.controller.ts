import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetTodoDto } from './dto/get-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponseEntity } from '../auth/entities/user.reponse.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UseGuards(JwtAuthGuard) //Contoh Guard salah satu route
  async getAllTodos(
    @Query() queryTodo: GetTodoDto,
    @CurrentUser() user: UserResponseEntity, // Get current user, jika mau dapat data user juga
  ) {
    const todos = await this.todoService.getAllTodos(queryTodo);

    return todos;
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
