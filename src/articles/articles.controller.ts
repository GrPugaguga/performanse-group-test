import {Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/User';
import { Public } from '../auth/decorators/public/public.decorator';
import { Article } from './entities/Article';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createArticleDto: CreateArticleDto, @CurrentUser() currentUser: User): Promise<Article> {
    return this.articlesService.create(createArticleDto, currentUser);
  }

  @Get()
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(@Query() query: { tags?: string | string[] },@CurrentUser() currentUser?: User): Promise<Article[]> {
    return this.articlesService.findAll(query, currentUser);
  }

  @Get(':id')
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser?: User): Promise<Article> {
    return this.articlesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto, @CurrentUser() currentUser: User): Promise<Article> {
    return this.articlesService.update(id, updateArticleDto, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: User): Promise<void> {
    await this.articlesService.remove(id, currentUser);
  }
}