const fastifyMysql = require('@fastify/mysql');

/**
 * Skapar kontakt med databasen.
 * @param { object } fastify - serverinstansen.
 */
async function mysqlDB(fastify) {
    await fastify.register(fastifyMysql, {
        promise: true,
        host: "mysql",
        port: Number(process.env.MYSQL_PORT),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    });

    fastify.log.info('MySQL Connected!');
}

module.exports = mysqlDB;