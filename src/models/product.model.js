const Product = {
    type: 'object',
    required: ['age_ratingID', 'title', 'description', 'price', 'stock'],
    properties: {
        age_ratingID: { type: 'number' },
        title: { type: 'string', minLength: 2, maxLength: 100 },
        description: { type: 'string' },
        price: { type: 'number', multipleOf: 0.01 },
        stock: { type: 'number' }
    }
}

const UpdateProduct = {
    type: 'object',
    properties: {
        age_ratingID: { type: 'number' },
        title: { type: 'string', minLength: 2, maxLength: 100 },
        description: { type: 'string' },
        price: { type: 'number', multipleOf: 0.01 },
        stock: { type: 'number' }
    }
}

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
        acknowledged: { type: 'boolean' },
        insertedId: { type: 'string' }
    }
}

const ProductAsList = {
    type: 'array',
    items: {
        type: 'object',
        required: ['id', 'title', 'description', 'price', 'stock', 'rating'],
        properties: {
            id: { type: 'number' },
            title: { type: 'string', minLength: 2, maxLength: 100 },
            description: { type: 'string' },
            price: { type: 'number', multipleOf: 0.01 },
            stock: { type: 'number' },
            rating: { type: 'string' },
            image_key: { type: ['string', 'null'] }
        }
    }
};

const post_product_schema = {
    schema: {
        body: Product,
        response: {
            201: Success
        }
    }
};

const get_products_schema = {
    schema: {
        response: {
            200: ProductAsList
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
        body: UpdateProduct,
        response: {
            200: {
                type: 'object',
                additionalProperties: true
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