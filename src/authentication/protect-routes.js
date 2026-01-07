const fp = require('fastify-plugin');

async function authPlugin(fastify, opts) {
    fastify.decorate('authenticate', async function (req, reply) {
        try {
            const raw = req.cookies.auth;
            const { valid, value: token } = req.unsignCookie(raw || '');

            if (!valid || !token) {
                const error = new Error('Authentication required.');
                error.statusCode = 401;
                throw error;
            }

            // Verfierar jwt från cookie.
            const decoded = await this.jwt.verify(token);
            req.user = decoded;
        } catch (e) {
            const error = new Error('Invalid or expired token.');
            error.statusCode = 401;
            throw error;
        }
    });
}

module.exports = fp(authPlugin);