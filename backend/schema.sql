CREATE TABLE IF NOT EXISTS USERS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    borrowed_book varchar(255),
    return_date varchar(255)
);

CREATE TABLE IF NOT EXISTS BOOKS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    published_year INT,
    available_copies VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS BORROWED_BOOKS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    book_id INT,
    borrow_date DATE,
    return_date DATE,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (book_id) REFERENCES BOOKS(id)
);
