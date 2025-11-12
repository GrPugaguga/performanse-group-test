import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('article_tags', (table) => {
    table.integer('article_id').unsigned().notNullable();
    table.integer('tag_id').unsigned().notNullable();
    table.foreign('article_id').references('id').inTable('articles').onDelete('CASCADE');
    table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');
    table.primary(['article_id', 'tag_id']); 
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('article_tags');
}

