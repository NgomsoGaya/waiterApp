CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    day VARCHAR(20) NOT NULL
);

CREATE TABLE usershifts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    shift_id INT REFERENCES shifts(id)
);
