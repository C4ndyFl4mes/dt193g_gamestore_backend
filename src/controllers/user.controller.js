const bcrypt = require('bcrypt');

// Registrerar en ny användare.
async function register_user(req, reply) {
    let connection;
    try {
        const { username, password } = req.body;
        connection = await this.mysql.getConnection();

        const password_hash = await bcrypt.hash(password, 10);


        const [result] = await connection.query('INSERT INTO users (username, password_hash) VALUES(?, ?)',
            [username, password_hash]);

        reply.send({
            success: true,
            message: 'Successfully registered an user.',
            username: username
        });
    } finally {
        if (connection) connection.release();
    }
}

// Loggar in en användare.
async function login_user(req, reply) {
    let connection;
    try {
        const { username, password } = req.body;
        connection = await this.mysql.getConnection();
        const [[result]] = await connection.query('SELECT password_hash FROM users WHERE username = ?;', [username]);
        if (!result) {
            const error = new Error("Invalid credentials.");
            error.statusCode = 401;
            throw error;
        }
        const match = await bcrypt.compare(password, result.password_hash);

        if (match) {
            const payload = {
                username: username
            };
            const token = this.jwt.sign(payload);
            reply.setCookie('auth', token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 3600,
                signed: true
            }).send({
                success: true,
                message: 'Logged in.',
                username: username
            });
        } else {
            const error = new Error('Invalid credentials.');
            error.statusCode = 401;
            throw error;
        }
    } finally {
        if (connection) connection.release();
    }
}

// Loggar ut en användare.
async function logout_user(req, reply) {
    reply.code(200).clearCookie('auth', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        signed: true
    }).send({
        success: true,
        message: 'Logged out.'
    });
}

// Tar bort en användare.
async function destroy_user(req, reply) {
    let connection;
    try {
        const username = req.query.username;

        connection = await this.mysql.getConnection();

        const result = await connection.query('DELETE FROM users WHERE username = ?', [username]);

        reply.send({
            success: true,
            message: `Successfully destroyed user ${username}.`
        });
    } finally {
        if (connection) connection.release();
    }
}

// Kollar om en användare är inloggad.
async function is_user_logged_in(req, reply) {
    reply.code(200).send({
        success: true,
        message: 'User is logged in'
    });
}

module.exports = {
    register_user,
    login_user,
    logout_user,
    destroy_user,
    is_user_logged_in
}