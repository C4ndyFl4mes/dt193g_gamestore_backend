const User = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string', minLength: 2, maxLength: 50 },
        password: { type: 'string', minLength: 255, maxLength: 255 }
    }
}

const Success = {
    type: 'object',
    properties: {
        acknowledged: { type: 'boolean' },
        insertedId: { type: 'string' }
    }
}

const register_user_schema = {
    schema: {
        body: User,
        response: {
            201: Success
        }
    }
}

const login_user_schema = {
    schema: {
        body: User,
        response: {
            200: Success
        }
    }
}

const logout_user_schema = {
    schema: {
        response: {
            200: Success
        }
    }
}

module.exports = {
    register_user_schema,
    login_user_schema,
    logout_user_schema
};