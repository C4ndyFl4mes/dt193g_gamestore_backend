const { PutObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('./../lib/r2');


async function image_routes(fastify, options) {

    fastify.post("/upload/image/:gameid", async (req, reply) => {
        const file = await req.file();

        if (!file) {
            return reply.code(400).send({ error: "No file uploaded" });
        }

        if (!file.mimetype.startsWith("image/")) {
            return reply.code(400).send({ error: "Invalid file type" });
        }

        const gameid = req.params.gameid;
        const ext = file.filename.split(".").pop();
        const key = `games/${gameid}.${ext}`;

        console.log("R2_BUCKET_NAME:", process.env.R2_BUCKET_NAME);

        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Body: await file.toBuffer(),
                ContentType: file.mimetype,
            })
        );

        const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        // Spara image_url till databasen.
        await fastify.mysql.query(
            "CALL AddImage(?, ?);",
            [gameid, imageUrl]
        );

        return { url: imageUrl };

    });
}

module.exports = image_routes;