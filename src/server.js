require('dotenv').config();
console.log('MySQL Config:', {
    host: process.env.MYSQLHOST || process.env.MYSQL_HOST,
    port: process.env.MYSQLPORT || process.env.MYSQL_PORT,
    user: process.env.MYSQLUSER || process.env.MYSQL_USER,
    database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE
});
const fastify = require('fastify')({ logger: true });
const mysqlDB = require('./config/db.js');
const port = process.env.PORT || 3401;

/**
 * Initierar servern som är bereonde av mySQL kontakten.
 */
async function init() {
    try {
        await mysqlDB(fastify); // Ansluter till mySQL databasen.

        fastify.register(require("./routes/user.route"));

        fastify.get('/test', async function (req, reply) {
            const connection = await fastify.mysql.getConnection();
            const [tables] = await connection.query('SHOW TABLES;');
            connection.release();
            reply.send({ tables: tables });
        });

        // Startar servern.
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server is running on port ${port}`);
    } catch(error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

init();