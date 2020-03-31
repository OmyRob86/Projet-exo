-- create table articles
CREATE TABLE node_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_articles_author FOREIGN KEY (author) REFERENCES node_users(id)
);

-- create table comments
CREATE TABLE node_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    articles_id INT NOT NULL,
    author INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_comments_articles_id FOREIGN KEY (articles_id) REFERENCES node_articles(id) ON DELETE CASCADE,
    CONSTRAINT FK_comments_author FOREIGN KEY (author) REFERENCES node_users(id)
);

/*INSERT INTO node_comments(article_id, author, content) VALUES
(1, 1, "lol"),
(2, 1, "no mames"),
(3, 1, "que cagado"),
(4, 1, "quien sabe"),
(5, 1, "esta perro"),
(6, 1, "jijiji");

ALTER TABLE node_comments ADD CONSTRAINT FK_comments_articles_id FOREIGN KEY (articles)