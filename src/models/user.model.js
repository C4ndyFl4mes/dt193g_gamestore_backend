const User = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: { type: 'string', minLength: 2, maxLength: 50 },
        password: { type: 'string', minLength: 16, maxLength: 255 }
    }
}

const Success = {
    type: 'object',
    required: ['success', 'message'],
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        username: { type: 'string' }
    }
}

// Schema för gemensam användning av username i query-parametrar.
const UsernameQuery = {
    type: 'object',
    required: ['username'],
    properties: {
        username: { type: 'string', minLength: 2, maxLength: 50 }
    }
};

// Schema för att registrera en ny användare.
const register_user_schema = {
    schema: {
        body: User,
        response: {
            201: Success
        }
    }
}

// Schema för att logga in en användare.
const login_user_schema = {
    schema: {
        body: User,
        response: {
            200: Success
        }
    }
}

// Schema för att logga ut en användare.
const logout_user_schema = {
    schema: {
        response: {
            200: Success
        }
    }
}

// Schema för att ta bort en användare.
const destroy_user_schema = {
    schema: {
        query: UsernameQuery,
        response: {
            200: Success
        }
    }
}

// Schema för att kolla om en användare är inloggad.
const is_user_logged_in_schema = {
    schema: {
        response: {
            200: Success
        }
    }
}

module.exports = {
    register_user_schema,
    login_user_schema,
    logout_user_schema,
    destroy_user_schema,
    is_user_logged_in_schema
};