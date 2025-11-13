import env from '../env/env.js';
import { Knex } from 'knex';
import path from 'path';

const BASE_PATH = path.join(process.cwd());
const MIGRATIONS_PATH = path.join(BASE_PATH, 'src', 'database', 'migrations');
const SEEDS_PATH = path.join(BASE_PATH, 'src', 'database', 'seeds');

const knexConfigs: Record<string, Knex.Config> = {
  development: {
    client: 'mysql2',
    connection: env.DATABASE_URL,
    migrations: {
      directory: MIGRATIONS_PATH,
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: SEEDS_PATH,
      extension: 'ts',
    },
  },
  production: {
    client: 'mysql2',
    connection: env.DATABASE_URL,
    migrations: {
      directory: MIGRATIONS_PATH.replace('src', 'dist'),
      tableName: 'knex_migrations',
      extension: 'js',
    },
    seeds: {
      directory: SEEDS_PATH.replace('src', 'dist'),
      extension: 'js',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default knexConfigs[env.NODE_ENV];
