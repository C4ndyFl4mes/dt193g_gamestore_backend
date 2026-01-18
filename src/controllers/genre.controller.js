
// Hämtar alla genrer från databasen.
async function get_genres(req, reply) {
    let connection;
    try {
        connection = await this.mysql.getConnection();

        const [genres] = await connection.query('SELECT * FROM genres ORDER BY genre_name ASC;');
        if (genres.length === 0) {
            const error = new Error('No genres found.');
            error.statusCode = 404;
            throw error;
        }

        reply.code(200).send({
            success: true,
            genres: genres
        });
    } finally {
        if (connection) connection.release();
    }
}

// Lägger till en ny genre i databasen.
async function add_genre(req, reply) {
    let connection;
    try {
        const { genre_name } = req.body;

        connection = await this.mysql.getConnection();

        const [result] = await connection.query('INSERT INTO genres (genre_name) VALUES(?)', [genre_name]);

        reply.code(201).send({
            success: true,
            genre: {
                id: result.insertId,
                genre_name: genre_name
            }
        });
    } finally {
        if (connection) connection.release();
    }
}

// Tar bort en genre från databasen.
async function delete_genre(req, reply) {
    let connection;
    try {
        const id = Number(req.query.id);

        connection = await this.mysql.getConnection();

        const [result] = await connection.query('DELETE FROM genres WHERE id = ?', [id]);

         if (result.affectedRows === 0) {
            const error = new Error('Genre not found.');
            error.statusCode = 404;
            throw error;
        }

        reply.code(200).send({
            success: true,
            message: 'Genre was deleted successfully.'
        });
    } finally {
        if (connection) connection.release();
    }
}

// Uppdaterar en genre i databasen.
async function update_genre(req, reply) {
    let connection;
    try {
        const id = Number(req.query.id);
        const { genre_name } = req.body;

        connection = await this.mysql.getConnection();

        const [result] = await connection.query('UPDATE genres SET genre_name = ? WHERE id = ?', [genre_name, id]);
        reply.code(200).send({
            success: true,
            genre: {
                id: id,
                genre_name: genre_name
            }
        });
    } finally {
        if (connection) connection.release();
    }
}

module.exports = {
    get_genres,
    add_genre,
    delete_genre,
    update_genre
};