/* Replace with your SQL commands */
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    salt VARCHAR NOT NULL,
    user_type VARCHAR NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_pic TEXT,
    verification_code VARCHAR(6),
    expiry TIMESTAMP,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);