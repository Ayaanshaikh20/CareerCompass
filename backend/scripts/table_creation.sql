CREATE TABLE register_users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL
        REFERENCES register_users(user_id)
        ON DELETE CASCADE,
    status VARCHAR(25) NOT NULL
        CHECK (status IN ('pending', 'approved', 'rejected')),
    job_link VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    experience NUMERIC(4,1) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    applied_date DATE NOT NULL,
    job_description TEXT NOT NULL,
    employer VARCHAR(100) NOT NULL,
    package INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_user_id ON applications(user_id);

CREATE TABLE public.forget_password
(
    id uuid PRIMARY KEY,
    email varchar(255) NOT NULL,
    token varchar(64) NOT NULL,
    expires_in timestamp NOT NULL,
    is_used boolean DEFAULT false,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
