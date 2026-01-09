const IdQuery = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer', minimum: 1 }
    }
};

const post_product_schema = {
    schema: {
        consumes: ['multipart/form-data'],
        response: {
            201: {
                type: 'object',
                required: ['success', 'id'],
                properties: {
                    success: { type: 'boolean' },
                    id: { type: 'integer', minimum: 1 }
                }
            }
        }
    }
};

const delete_product_schema = {
    schema: {
        query: IdQuery,
        response: {
            200: {
                type: 'object',
                additionalProperties: true
            }
        }
    }
}

const update_product_schema = {
    schema: {
        query: IdQuery,
        consumes: ['multipart/form-data'],
        response: {
            200: {
                type: 'object',
                required: ['success', 'game'],
                properties: {
                    success: { type: 'boolean' },
                    game: {
                        type: 'object',
                        additionalProperties: true
                    }
                }
            }
        }
    }
};

module.exports = {
    post_product_schema,
    delete_product_schema,
    update_product_schema
}