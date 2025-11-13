import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('articles', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('content');
    table.boolean('isPublic').notNullable().defaultTo(false);
    table.integer('author_id').unsigned().notNullable();
    table
      .foreign('author_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));

    table.index(['author_id']);
    table.index(['isPublic']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('articles');
}
