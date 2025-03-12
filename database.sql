-- Active: 1688384959620@@127.0.0.1@3306@m2i_gre_social
DROP TABLE IF EXISTS post;

DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    posted_at DATETIME NOT NULL,
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES user (id)
);


INSERT INTO user (username,email,password,role, created_at) VALUES
('modo','modo@modo.com', '$2b$05$P.xKIqo1m83f04hQ8tP3B.5qoGt5LtcT4O1EJw/FfgaoZPojq9aXa', 'ROLE_MODO', NOW()),
('test', 'test@test.com', '$2b$05$P.xKIqo1m83f04hQ8tP3B.5qoGt5LtcT4O1EJw/FfgaoZPojq9aXa', 'ROLE_USER', NOW());

INSERT INTO post (content, posted_at,author_id) VALUES 
('test post', NOW(), 1),
('test post 2', NOW(), 1),
('test post 3', NOW(), 1),
('test post 4', NOW(), 2),
('test post 5', NOW(), 2),
('test post 6', NOW(), 2),
('test post 7', NOW(), 2),
('test post 8', NOW(), 2),
('test post 9', NOW(), 2),
('test post 10', NOW(), 2),
('test post 11', NOW(), 2),
('test post 12', NOW(), 2),
('test post 13', NOW(), 2),
('test post 14', NOW(), 2),
('test post 15', NOW(), 2);