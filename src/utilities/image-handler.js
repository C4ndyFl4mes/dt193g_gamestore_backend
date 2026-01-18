const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('../lib/r2');

/**
 * Laddar upp bilder till r2.
 * @param {object} file - bildfil.
 * @param {number} id - vilket spel det handlar om.
 * @param {object} connection - upprätthåller kontakt med databasen.
 * @returns { object } - url.
 */
async function uploadImage(file, id, connection) {

    // Kontrollerar att filen existerar och är av rätt typ.
    if (!file) {
        const error = new Error('No file uploaded.');
        error.statusCode = 400;
        throw error;
    }

    if (!file.mimetype.startsWith("image/")) {
        const error = new Error('Invalid file type.');
        error.statusCode = 400;
        throw error;
    }

    const ext = file.filename.split(".").pop();

    // Endast jpg tillåts.
    if (ext !== "jpg") {
        const error = new Error('The only image type supported is jpg.');
        error.statusCode = 400;
        throw error;
    }

    const key = `games/${id}.${ext}`;

    // Lägger till bilden.
    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        })
    );

    const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`; // Bygger url som kan användas för att nå bilden.

    await connection.query('CALL AddImage(?, ?);', [id, imageUrl]);
    return { url: imageUrl };
}

/**
 * // Raderar en bild från r2.
 * @param {number} id - vilket spel det gäller.
 * @param {object} connection - kontakten med databasen.
 */
async function deleteImage(id, connection) {
    await r2.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `games/${id}.jpg`,
        }));
    await connection.query('DELETE FROM images WHERE gameID = ?', [id]);
}

module.exports = {
    uploadImage,
    deleteImage
};