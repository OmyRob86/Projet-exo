CREATE TABLE node_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    author INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_articles_author FOREIGN KEY (author) REFERENCES node_users(id)
);

CREATE TABLE node_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    author INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_comments_articles_id FOREIGN KEY (articles_id) REFERENCES node_articles(id),
    CONSTRAINT FK_comments_author FOREIGN KEY (author) REFERENCES node_users(id)
);
