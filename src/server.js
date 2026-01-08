require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const mysqlDB = require('./config/db.js');
const port = process.env.PORT || 3401;



/**
 * 
 * Felhanteringskällor
 * MySQL: https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html
 * Statuskoder: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes 
 * 
 */
fastify.setErrorHandler((error, req, reply) => {
    // console.log(error);

    // MySQL felhantering.
    if (error.code) {
        const msg = error.sqlMessage || '';
        switch (error.code) {
            case 'ER_DUP_ENTRY':
                if (msg.includes('games.title')) {
                    return reply.code(409).send({
                        success: false,
                        message: 'A game with this title already exists.'
                    });
                }

                if (msg.includes('users.username')) {
                    return reply.code(409).send({
                        success: false,
                        message: 'Username already exists.'
                    });
                }

                return reply.code(409).send({
                    success: false,
                    message: 'A duplicate entry.'
                });
            case 'ER_NO_REFERENCED_ROW_2':
                return reply.code(400).send({
                    success: false,
                    message: 'Invalid age rating ID.'
                });
            // Lägger till allteftersom mer fel ska hanteras.
        }
    }

    // Hanterar Fastify valideringsfel.
    if (error.validation) {
        return reply.code(400).send({
            success: false,
            message: 'Validation error',
            errors: error.validation
        });
    }

    // Hanterar HTTP fel.
    if (error.statusCode) {
        return reply.code(error.statusCode).send({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error : undefined // För att dölja felmeddelandet vid produktion.
        });
    }

    reply.code(500).send({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined // För att dölja felmeddelandet vid produktion.
    });
});


/**
 * Initierar servern som är bereonde av mySQL kontakten.
 */
async function init() {
    try {
        await mysqlDB(fastify); // Ansluter till mySQL databasen.

        fastify.register(require('@fastify/jwt'), {
            secret: process.env.TOKEN_SECRET,
            cookie: {
                cookieName: 'auth'
            }
        });

        fastify.register(require('@fastify/cookie'), {
            secret: process.env.COOKIE_SECRET,
            hook: 'onRequest'
        });

        fastify.register(require('./authentication/protect-routes'));


        // Begränsar filstorlekar.
        fastify.register(require('@fastify/multipart'), {
            limits: {
                fileSize: 5 * 1024 * 1024
            }
        });

        fastify.register(require("./routes/user.route"), { prefix: '/user' });
        fastify.register(require("./routes/product.route"), { prefix: '/game' });
        fastify.register(require("./routes/genre.route"), { prefix: '/genre' });


        // Startar servern.
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server is running on port ${port}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

init();