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

const get_products_schema = {
    schema: {
        response: {
            200: {
                type: 'object',
                required: ['success', 'games'],
                properties: {
                    success: { type: 'boolean' },
                    games: {
                        type: 'array',
                        items: {
                            type: 'object',
                            required: ['id', 'title', 'description', 'price', 'stock', 'rating'],
                            properties: {
                                id: { type: 'integer', minimum: 1 },
                                title: { type: 'string', minLength: 2, maxLength: 100 },
                                description: { type: 'string' },
                                price: { type: 'number', multipleOf: 0.01 },
                                stock: { type: 'number' },
                                rating: { type: 'integer', minimum: 1 },
                                image_key: { type: ['string', 'null'] },
                                genres: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', minimum: 1 },
                                            name: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
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
    get_products_schema,
    delete_product_schema,
    update_product_schema
}