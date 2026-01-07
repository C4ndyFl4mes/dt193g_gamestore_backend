const { post_product_schema, get_products_schema, delete_product_schema, update_product_schema } = require('../models/product.model');

const { get_products, add_product, delete_product, update_product } = require('../controllers/product.controller');


async function product_routes(fastify, options) {

    // Hämtar alla produkter.
    fastify.get('/products', {
        onRequest: [fastify.authenticate],
        ...get_products_schema
    }, get_products.bind(fastify));

    // Lägger till en produkt.
    fastify.post('/product', {
        onRequest: [fastify.authenticate],
        ...post_product_schema
    }, add_product.bind(fastify));

    // Raderar en produkt.
    fastify.delete('/products', {
        onRequest: [fastify.authenticate],
        ...delete_product_schema
    }, delete_product.bind(fastify));

    // Uppdaterar en produkt.
    fastify.put('/products', {
        onRequest: [fastify.authenticate],
        ...update_product_schema
    }, update_product.bind(fastify));
}

module.exports = product_routes;