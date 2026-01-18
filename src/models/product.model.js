// Schema för gemensam användning av id i query-parametrar.
const IdQuery = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer', minimum: 1 }
    }
};

// Schema för att skapa en ny produkt.
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

// Schema för att ta bort en produkt.
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

// Schema för att uppdatera en produkt.
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