const { get_genres, add_genre, delete_genre, update_genre } = require("../controllers/genre.controller");
const { post_genre_schema, delete_genre_schema, update_genre_schema } = require("../models/genre.model");


async function genre_routes(fastify, options) {

    // Hämtar alla genrer.
    fastify.get('/genres', {
        onRequest: [fastify.authenticate]
    }, get_genres.bind(fastify));

    // Listar en genre.
    fastify.post('/genre', {
        onRequest: [fastify.authenticate],
        ...post_genre_schema
    }, add_genre.bind(fastify));

    // Raderar en genre.
    fastify.delete('/genres', {
        onRequest: [fastify.authenticate],
        ...delete_genre_schema
    }, delete_genre.bind(fastify));

    // Uppdaterar en genre.
    fastify.put('/genres', {
        onRequest: [fastify.authenticate],
        ...update_genre_schema
    }, update_genre.bind(fastify));
}

module.exports = genre_routes;