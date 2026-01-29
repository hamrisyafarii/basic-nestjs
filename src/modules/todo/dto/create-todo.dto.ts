import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MaxLength(20)
  label: string;

  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    return new Date(value);
  })
  dueDate?: Date;
}
