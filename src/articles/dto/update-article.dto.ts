import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty({ description: 'Новый заголовок статьи', example: 'Обновленная статья', required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Заголовок не может быть пустым.' })
  title: string;

  @ApiProperty({ description: 'Новое содержание статьи', example: 'Это обновленное содержание статьи.', required: false })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Содержание не может быть пустым.' })
  content: string;

  @ApiProperty({ description: 'Новый признак публичности статьи', example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ description: 'Новый список тегов статьи', example: ['nestjs', 'javascript'], type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
