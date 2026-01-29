import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';
import { Transform } from 'class-transformer';

export class UpdateTodoDto implements Partial<CreateTodoDto> {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  label?: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    return new Date(value);
  })
  dueDate?: Date;
}
