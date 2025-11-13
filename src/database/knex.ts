import _knex from 'knex';
import knexConfig from '../config/knex/knexfile';

const knex = _knex(knexConfig);

export default knex;
