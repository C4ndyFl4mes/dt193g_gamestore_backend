ALTER TABLE games (
    ADD CONSTRAINT fk_user
    FOREIGN KEY (userID) REFERENCES users(id),
    ADD CONSTRAINT fk_age_rating
    FOREIGN KEY (age_ratingID) REFERENCES age_ratings(id)
);

ALTER TABLE genres (
    ADD CONSTRAINT fk_genre_user
    FOREIGN KEY (userID) REFERENCES users(id)
);

ALTER TABLE game_genres (
    ADD CONSTRAINT fk_game
    FOREIGN KEY (gameID) REFERENCES games(id),
    ADD CONSTRAINT fk_genre
    FOREIGN KEY (genreID) REFERENCES genres(id)
);