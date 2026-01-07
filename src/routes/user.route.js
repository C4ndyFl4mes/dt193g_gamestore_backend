const { register_user_schema, login_user_schema, logout_user_schema, is_user_logged_in_schema, destroy_user_schema } = require('../models/user.model');

const { register_user, login_user, logout_user, is_user_logged_in, destroy_user } = require('../controllers/user.controller');

async function user_routes(fastify, options) {

    // Skapar en ny användare.
    fastify.post('/register', {
        ...register_user_schema
    }, register_user.bind(fastify));

    // Loggar in användaren.
    fastify.post('/login', {
        ...login_user_schema
    }, login_user.bind(fastify));

    // Loggar ut användaren.
    fastify.post('/logout', {
        ...logout_user_schema
    }, logout_user.bind(fastify));

    // Kollar om användaren är inloggad.
    fastify.post('/check', {
        onRequest: [fastify.authenticate],
        ...is_user_logged_in_schema
    }, is_user_logged_in.bind(fastify));

    fastify.delete('/destroy', {
        onRequest: [fastify.authenticate],
        ...destroy_user_schema
    }, destroy_user.bind(fastify));
}

module.exports = user_routes;