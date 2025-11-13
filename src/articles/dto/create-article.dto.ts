import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Заголовок статьи',
    example: 'Моя первая статья',
  })
  @IsString()
  @IsNotEmpty({ message: 'Заголовок не может быть пустым.' })
  title: string;

  @ApiProperty({
    description: 'Содержание статьи',
    example: 'Это очень интересная статья о чем-то.',
  })
  @IsString()
  @IsNotEmpty({ message: 'Содержание не может быть пустым.' })
  content: string;

  @ApiProperty({
    description: 'Признак публичности статьи',
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({
    description: 'Список тегов статьи',
    example: ['nestjs', 'typescript'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
