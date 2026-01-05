

async function user_routes(fastify, options) {
    fastify.get('/', async (req, reply) => {
        return { message: "It is working..." };
    });
}

module.exports = user_routes;