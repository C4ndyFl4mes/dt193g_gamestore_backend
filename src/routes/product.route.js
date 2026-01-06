const { post_product_schema, get_products_schema, delete_product_schema, update_product_schema } = require('../models/product.model');

async function product_routes(fastify, options) {

    fastify.post('/product', post_product_schema, async (req, reply) => {
        const { title, description, price, stock, age_ratingID } = req.body;
        const connection = await fastify.mysql.getConnection();

        const product = await connection.query('INSERT INTO games (age_ratingID, title, description, price, stock) VALUES(?, ?, ?, ?, ?)',
            [age_ratingID, title, description, price, stock]);

        reply.send({
            product: product
        });
    });

    fastify.get('/products', get_products_schema, async (req, reply) => {
        const connection = await fastify.mysql.getConnection();
        const order = req.query.order_by || 'title_asc';

        const [[products]] = await connection.query('CALL GetGames(?)', [order]);

        reply.send(products);
    });

    fastify.delete('/products', delete_product_schema, async (req, reply) => {
        const id = Number(req.query.id);

        if (!id) {
            return new Error("ID is invalid: " + id);
        }

        const connection = await fastify.mysql.getConnection();

        const product = await connection.query('DELETE FROM games WHERE id = ?;', [id]);

        reply.send(product);
    });

    fastify.put('/products', update_product_schema, async (req, reply) => {
        const id = Number(req.query.id);
        const { title, description, price, stock, age_ratingID } = req.body;

        if (!id) {
            return new Error("ID is invalid: " + id);
        }

        const connection = await fastify.mysql.getConnection();

        const [product] = await connection.query('UPDATE games SET title = ?, description = ?, price = ?, stock = ?, age_ratingID = ? WHERE id = ?', 
            [title, description, price, stock, age_ratingID, id]);

         reply.send(product);
    });
}

module.exports = product_routes;