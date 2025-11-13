import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: 'Заголовок не может быть пустым.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Содержание не может быть пустым.' })
  content: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
