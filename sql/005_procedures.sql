
DELIMITER $$

DROP PROCEDURE IF EXISTS AddImage$$

CREATE PROCEDURE AddImage (
    IN p_gameID INT,
    IN p_image_key VARCHAR(500)
) 
BEGIN
    INSERT INTO images (gameID, image_key)
    VALUES (p_gameID, p_image_key)
    ON DUPLICATE KEY UPDATE image_key = VALUES(image_key);
END$$

DROP PROCEDURE IF EXISTS GetGames$$

CREATE PROCEDURE GetGames (
    IN p_order_by VARCHAR(50)
)
BEGIN
    SELECT g.id, g.title, g.description, g.price, g.stock,
           ar.rating, img.image_key
    FROM games g
    LEFT JOIN age_ratings ar ON g.age_ratingID = ar.id
    LEFT JOIN images img ON g.id = img.gameID
    ORDER BY
        CASE WHEN p_order_by = 'title_asc' THEN g.title END ASC,
        CASE WHEN p_order_by = 'title_desc' THEN g.title END DESC,
        CASE WHEN p_order_by = 'stock_asc' THEN g.stock END ASC,
        CASE WHEN p_order_by = 'stock_desc' THEN g.stock END DESC,
        g.title ASC;
END$$

DELIMITER ;