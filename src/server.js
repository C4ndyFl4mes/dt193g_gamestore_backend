require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const port = process.env.PORT | 3401;


fastify.register(require("./routes/user.route"));

// Kör servern.
fastify.listen({ port: port, host: "0.0.0.0" }, function (error, address) {
    if(error) {
        fastify.log.error(error);
        process.exit(1);
    }
    console.log(`Server is running on ${address}`);
});