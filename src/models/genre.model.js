const Genre = {
    type: 'object',
    required: ['genre_name'],
    properties: {
        id: { type: 'integer', minimum: 1 },
        genre_name: { type: 'string', minLength: 2, maxLength: 50 }
    }
};

const IdQuery = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer', minimum: 1 }
    }
};

const Success = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
    }
};

const ReturnGenre = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        genre: Genre
    }
}

const post_genre_schema = {
    schema: {
        body: Genre,
        response: {
            201: ReturnGenre
        }
    }
};

const delete_genre_schema = {
    schema: {
        query: IdQuery,
        response: {
            200: Success
        }
    }
};

const update_genre_schema = {
    schema: {
        query: IdQuery,
        body: Genre,
        response: {
            200: ReturnGenre
        }
    }
};

module.exports = {
    post_genre_schema,
    delete_genre_schema,
    update_genre_schema
};