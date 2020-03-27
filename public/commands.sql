CREATE TABLE node_articles (
    id INT PRIMARY KEY,
    title VARCHAR(100),
    content VARCHAR(1000),
    author INT,
    created_at DATETIME
);

CREATE TABLE node_comments (
    id INT PRIMARY KEY,
    article_id INT,
    author INT,
    content VARCHAR(1000),
    created_at DATETIME
);
