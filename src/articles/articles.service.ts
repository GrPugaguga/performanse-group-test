import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import knex from '../database/knex';
import { Article } from './entities/Article';
import { Tag } from './entities/Tag';
import { User } from '../users/entities/User';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  async create(createArticleDto: CreateArticleDto, currentUser: User): Promise<Article> {
    const { tags: tagNames, ...articleData } = createArticleDto;

    const articleEntity = Article.create({
      authorId: currentUser.id,
      ...articleData,
    });

    await knex.transaction(async (trx) => {
      const [articleId] = await trx('articles').insert({
        title: articleEntity.title,
        content: articleEntity.content,
        authorId: articleEntity.authorId,
        isPublic: articleEntity.isPublic,
        createdAt: articleEntity.createdAt,
        updatedAt: articleEntity.updatedAt,
      });
      articleEntity.id = articleId;

      if (tagNames && tagNames.length > 0) {
        await this.synchronizeTags(articleId, tagNames, trx);
      }
    });

    return this.findOne(articleEntity.id, currentUser);
  }

  async findAll(query: { tags?: string | string[] }, currentUser?: User): Promise<Article[]> {
    const qb = knex('articles').select('articles.*');

    if (!currentUser) {
      qb.where('isPublic', true);
    }

    if (query.tags) {
      const tagsArray = Array.isArray(query.tags)
        ? query.tags
        : query.tags.split(',').map(tag => tag.trim());
        
      const normalizedTags = tagsArray.map(Tag.normalize).filter(Boolean);

      if (normalizedTags.length > 0) {
        qb.join('article_tags', 'articles.id', 'article_tags.article_id')
          .join('tags', 'article_tags.tag_id', 'tags.id')
          .whereIn('tags.name', normalizedTags)
          .groupBy('articles.id')
          .having(knex.raw('COUNT(DISTINCT "tags"."id")'), '=', normalizedTags.length);
      }
    }

    const articlesData = await qb;
    if (articlesData.length === 0) {
      return [];
    }

    const articleIds = articlesData.map((a) => a.id);
    const tagsData = await knex('tags')
      .join('article_tags', 'tags.id', 'article_tags.tag_id')
      .whereIn('article_tags.article_id', articleIds)
      .select('tags.*', 'article_tags.article_id as articleId');

    const articles = articlesData.map((articleData) => {
      const article = new Article(articleData);
      const articleTags = tagsData
        .filter((tag) => tag.articleId === article.id)
        .map((tag) => new Tag(tag));
      article.setTags(articleTags);
      return article;
    });

    return articles;
  }

  async findOne(id: number, currentUser?: User): Promise<Article> {
    const articleData = await knex('articles').where({ id }).first();
    if (!articleData) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    const tagsData = await knex('tags')
      .join('article_tags', 'tags.id', 'article_tags.tag_id')
      .where('article_tags.article_id', id)
      .select('tags.*');

    const article = new Article(articleData);
    const tags = tagsData.map((tagData) => new Tag(tagData));
    article.setTags(tags);

    if (!article.isPublic && !currentUser) {
      throw new ForbiddenException('Access to this article is forbidden');
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, currentUser: User): Promise<Article> {
    const article = await this.findOne(id, currentUser);

    if (!currentUser.canModifyArticle(article.authorId)) {
      throw new ForbiddenException('You do not have permission to modify this article');
    }

    const { tags: tagNames, ...articleUpdateData } = updateArticleDto;

    await knex.transaction(async (trx) => {
      if (Object.keys(articleUpdateData).length > 0) {
        await trx('articles').where({ id }).update({
          ...articleUpdateData,
          updatedAt: new Date(),
        });
      }

      if (tagNames) {
        await this.synchronizeTags(id, tagNames, trx);
      }
    });

    return this.findOne(id, currentUser);
  }

  async remove(id: number, currentUser: User): Promise<void> {
    const article = await this.findOne(id, currentUser);

    if (!currentUser.canModifyArticle(article.authorId)) {
      throw new ForbiddenException('You do not have permission to delete this article');
    }

    await knex('articles').where({ id }).del();
  }

  private async synchronizeTags(articleId: number, tagNames: string[], trx: any) {
    const normalizedTagNames = tagNames.map(Tag.normalize).filter(Boolean);

    const existingTags = await trx('tags').whereIn('name', normalizedTagNames);
    const existingTagNames = existingTags.map((tag) => tag.name);

    const newTagNames = normalizedTagNames.filter(
      (name) => !existingTagNames.includes(name),
    );

    let newTagIds: number[] = [];
    if (newTagNames.length > 0) {
      const result = await trx('tags').insert(newTagNames.map((name) => ({ name })));
      newTagIds = result;
    }

    const allTagIds = [...existingTags.map((tag) => tag.id), ...newTagIds];

    await trx('article_tags').where({ article_id: articleId }).del();
    if (allTagIds.length > 0) {
      const articleTagPairs = allTagIds.map((tagId) => ({
        article_id: articleId,
        tag_id: tagId,
      }));
      await trx('article_tags').insert(articleTagPairs);
    }
  }
}