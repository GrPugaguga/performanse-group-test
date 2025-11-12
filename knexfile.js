// Этот файл просто говорит Knex CLI, где найти настоящую конфигурацию
// Важно: ts-node/register будет использован для компиляции .ts файла на лету
require('ts-node/register');
module.exports = require('./src/config/knex/knexfile.ts');
