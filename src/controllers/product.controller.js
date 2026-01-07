async function get_products(req, reply) {
    let connection;
    try {
        connection = await this.mysql.getConnection();
        const order = req.query.order_by || 'title_asc';

        const [[products]] = await connection.query('CALL GetGames(?)', [order]);

        if (products.length === 0) {
            const error = new Error('No games found.');
            error.statusCode = 404;
            throw error;
        }

        reply.code(200).send({
            success: true,
            games: products
        });
    } finally {
        if (connection) connection.release();
    }
}

async function add_product(req, reply) {
    let connection;
    try {
        const { title, description, price, stock, age_ratingID } = req.body;
        connection = await this.mysql.getConnection();
        const [result] = await connection.query('INSERT INTO games (age_ratingID, title, description, price, stock) VALUES(?, ?, ?, ?, ?)',
            [age_ratingID, title, description, price, stock]);

        reply.code(201).send({
            success: true,
            id: result.insertId
        });
    } finally {
        if (connection) connection.release();
    }
}

async function delete_product(req, reply) {
    let connection;
    try {
        const id = Number(req.query.id);
        connection = await this.mysql.getConnection();

        const [result] = await connection.query('DELETE FROM games WHERE id = ?;', [id]);

        if (result.affectedRows === 0) {
            const error = new Error('Game not found.');
            error.statusCode = 404;
            throw error;
        }

        reply.code(200).send({
            success: true,
            message: 'Game was deleted successfully.'
        });
    } finally {
        if (connection) connection.release();
    }
}

async function update_product(req, reply) {
    let connection;
    try {
        const id = Number(req.query.id);
        const { title, description, price, stock, age_ratingID } = req.body;

        connection = await this.mysql.getConnection();

        const [result] = await connection.query('UPDATE games SET title = ?, description = ?, price = ?, stock = ?, age_ratingID = ? WHERE id = ?',
            [title, description, price, stock, age_ratingID, id]);

        if (result.affectedRows === 0) {
            const error = new Error('Game not found.');
            error.statusCode = 404;
            throw error;
        }

        reply.code(200).send({
            success: true,
            game: result
        });
    } finally {
        if (connection) connection.release();
    }
}
module.exports = {
    get_products,
    add_product,
    delete_product,
    update_product
};