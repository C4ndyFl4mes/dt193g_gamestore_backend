async function user_routes(fastify, options) {
    fastify.get('/', async (req, reply) => {
        return { message: "It is working..." };
    });

    fastify.get('/testout', async function (req, reply) {
        const connection = await fastify.mysql.getConnection();
        const [ rows ] = await connection.query('SELECT * FROM games JOIN images ON games.id = images.gameID;');
        connection.release();
        reply.send({ data: rows });
    });

    fastify.post('/register', async (req, reply) => {
        const { username, password } = req.body;
        const connection = await fastify.mysql.getConnection();

        const user = await connection.query('INSERT INTO users (username, password_hash) VALUES(?, ?)', 
            [username, password]);

        reply.send({ user: user });
    });
}

module.exports = user_routes;