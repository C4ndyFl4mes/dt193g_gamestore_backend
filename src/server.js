require('dotenv').config();

const fastify = require('fastify')({ logger: true });
// const multipart = ;
const mysqlDB = require('./config/db.js');
const port = process.env.PORT || 3401;

/**
 * Initierar servern som är bereonde av mySQL kontakten.
 */
async function init() {
    try {
        await mysqlDB(fastify); // Ansluter till mySQL databasen.

        // Begränsar filstorlekar.
        fastify.register(require('@fastify/multipart'), {
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        });
        fastify.register(require("./routes/user.route"));
        fastify.register(require("./routes/product.route"));
        fastify.register(require("./routes/image.route"));
       

        // Startar servern.
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server is running on port ${port}`);
    } catch(error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

init();