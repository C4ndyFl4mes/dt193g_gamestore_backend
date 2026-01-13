const { uploadImage, deleteImage } = require('../utilities/image-handler');

async function get_products(req, reply) {
    let connection;
    try {
        connection = await this.mysql.getConnection();
        const order = req.query.order_by || 'title_asc';

        const [rows] = await connection.query('CALL GetGames(?)', [order]);

        if (rows.length === 0) {
            const error = new Error('No games found.');
            error.statusCode = 404;
            throw error;
        }

        // Grupperar spelen så att alla genres är per spel.
        const gamesMap = new Map();
        rows.forEach(row => {
            if (!gamesMap.has(row.id)) {
                    gamesMap.set(row.id, {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        price: row.price,
                        stock: row.stock,
                        age_ratingID: row.age_ratingID,
                        image_key: row.image_key,
                        genres: []
                    });
            }

            if (row.genreID && row.genre_name) {
                gamesMap.get(row.id).genres.push({
                    id: row.genreID,
                    genre_name: row.genre_name
                });
            }
        });

        const products = Array.from(gamesMap.values());
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
        const parts = req.parts();
        const fields = {};
        let imageFile = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                const buffer = await part.toBuffer();
                imageFile = {
                    buffer: buffer,
                    filename: part.filename,
                    mimetype: part.mimetype
                };
            } else {
                fields[part.fieldname] = part.value;
            }
        }

        // Konverterar text siffror till siffror. Om undefined så blir värdet det och inte uppdateras i databasen.
        const parseNumberField = (value, name) => {
            if (value === undefined) return undefined;
            const num = Number(value);
            // Ett felmeddelande ifall en kolumn inte ska vara en siffra.
            if (Number.isNaN(num)) {
                const err = new Error(`Invalid ${name}`);
                err.statusCode = 400;
                throw err;
            }
            return num;
        };

        const price = parseNumberField(fields.price, 'price');

        const title = fields.title;
        const description = fields.description;
        const stock = fields.stock ? parseInt(fields.stock) : undefined;
        const age_ratingID = fields.age_ratingID ? parseInt(fields.age_ratingID) : undefined;
        const genreIDs = fields.genres ? JSON.parse(fields.genres) : undefined;


        // Alla fällt måste existera
        if (!title || !description || price === undefined || stock === undefined || !age_ratingID || !genreIDs) {
            const error = new Error('Missing one or more of the required fields: title, description, price, stock, age_ratingID, and genres.');
            error.statusCode = 400;
            throw error;
        }

        if (title.trim().length === 0 || description.trim().length === 0) {
            const error = new Error('Title and description cannot be empty.');
            error.statusCode = 400;
            throw error;
        }

        

        if (price < 0 || stock < 0) {
            const error = new Error('Price and stock cannot be negative.');
            error.statusCode = 400;
            throw error;
        }


        connection = await this.mysql.getConnection();
        const [result] = await connection.query('INSERT INTO games (age_ratingID, title, description, price, stock) VALUES(?, ?, ?, ?, ?)',
            [age_ratingID, title, description, price, stock]);

        const insertId = result.insertId;

        // Laddar upp bild till r2.
        if (imageFile && insertId) {
            await uploadImage(imageFile, insertId, connection);
        }

        if (Array.isArray(genreIDs) && insertId) {
            for (let i = 0; i < genreIDs.length; i++) {
                await connection.query('INSERT INTO game_genres (gameID, genreID) VALUES(?, ?)', [insertId, genreIDs[i]]);
            }
        }

        reply.code(201).send({
            success: true,
            id: insertId
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

        await deleteImage(id, connection);

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
        const parts = req.parts();
        const fields = {};
        let imageFile = null;

        for await (const part of parts) {
            if (part.type === 'file') {
                const buffer = await part.toBuffer();
                imageFile = {
                    buffer: buffer,
                    filename: part.filename,
                    mimetype: part.mimetype
                };
            } else {
                fields[part.fieldname] = part.value;
            }
        }

        const title = fields.title ?? undefined;
        const description = fields.description ?? undefined;

        // Konverterar text siffror till siffror. Om undefined så blir värdet det och inte uppdateras i databasen.
        const parseNumberField = (value, name) => {
            if (value === undefined) return undefined;
            const num = Number(value);
            // Ett felmeddelande ifall en kolumn inte ska vara en siffra.
            if (Number.isNaN(num)) {
                const err = new Error(`Invalid ${name}`);
                err.statusCode = 400;
                throw err;
            }
            return num;
        };

        const price = parseNumberField(fields.price, 'price');
        const stock = parseNumberField(fields.stock, 'stock');
        const age_ratingID = parseNumberField(fields.age_ratingID, 'age_ratingID');
        const genreIDs = fields.genres ? JSON.parse(fields.genres) : undefined;


        // Valideringar.
        if (title !== undefined && title.trim().length === 0) {
            const error = new Error('Title cannot be empty.');
            error.statusCode = 400;
            throw error;
        }

        if (description !== undefined && description.trim().length === 0) {
            const error = new Error('Description cannot be empty.');
            error.statusCode = 400;
            throw error;
        }

        if (price !== undefined && price < 0) {
            const error = new Error('Price cannot be negative.');
            error.statusCode = 400;
            throw error;
        }

        if (stock !== undefined && stock < 0) {
            const error = new Error('Stock cannot be negative.');
            error.statusCode = 400;
            throw error;
        }

        if (age_ratingID !== undefined && age_ratingID < 1) {
            const error = new Error('Age_ratingID cannot be under one.');
            error.statusCode = 400;
            throw error;
        }


        connection = await this.mysql.getConnection();

        // Dynamiska uppdatering. Det beror på vilka fält som är tillagda.
        const updates = [];
        const values = [];


        if (title) {
            updates.push('title = ?');
            values.push(title);
        }

        if (description) {
            updates.push('description = ?');
            values.push(description);
        }

        if (price !== undefined) {
            updates.push('price = ?');
            values.push(price);
        }
        if (stock !== undefined) {
            updates.push('stock = ?');
            values.push(stock);
        }
        if (age_ratingID !== undefined) {
            updates.push('age_ratingID = ?');
            values.push(age_ratingID);
        }

        if (updates.length > 0) {
            values.push(id);
            const [result] = await connection.query(
                `UPDATE games SET ${updates.join(', ')} WHERE id = ?`,
                values
            );

            if (result.affectedRows === 0) {
                const error = new Error('Game not found.');
                error.statusCode = 404;
                throw error;
            }
        }

        let image_key;

        // Laddar upp bild till r2.
        if (imageFile) {
            imageURL = await uploadImage(imageFile, id, connection);
        } else {
            const [row] = await connection.query('SELECT image_key FROM images WHERE gameID = ?', [id]);
            image_key = row ? row.image_key : undefined;
        }

        if (Array.isArray(genreIDs)) {
            await connection.query('DELETE FROM game_genres WHERE gameID = ?', [id]);

            for (let i = 0; i < genreIDs.length; i++) {
                await connection.query('INSERT INTO game_genres (gameID, genreID) VALUES(?, ?)', [id, genreIDs[i]]);
            }
        }

        reply.code(200).send({
            success: true,
            game: {
                id,
                title,
                description,
                price,
                stock,
                age_ratingID,
                genreIDs,
                image_key
            }
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