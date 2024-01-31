CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email varchar NOT NULL UNIQUE,
    username varchar NOT NULL,
    password varchar NOT NULL
);

-- Get user by id 
CREATE OR REPLACE FUNCTION get_user_by_id(
    _id integer
)
RETURNS TABLE(
    id integer,
    email varchar,
    username varchar,
    password varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "user" WHERE id = _id) THEN
        RAISE EXCEPTION 'No user found with id %', _id;
    END IF; 

    RETURN QUERY 
    SELECT id, email, username, password
    FROM "user"
    WHERE id = _id;
END;
$$

-- Get user by email 
CREATE OR REPLACE FUNCTION get_user_by_email(
    _email varchar
)
RETURNS TABLE(
    id integer,
    email varchar,
    username varchar,
    password varchar
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "user" WHERE email = _email) THEN
        RAISE EXCEPTION 'No user found with email %', _email;
    END IF; 

    RETURN QUERY 
    SELECT id, email, username, password
    FROM "user"
    WHERE email = _email;
END;
$$

-- User insetion
CREATE OR REPLACE FUNCTION insert_user(
    _username varchar,
    _password varchar,
    _email varchar
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id integer;    
BEGIN
    -- Insert the new user data into the user table
    INSERT INTO "user" (username, password, email)
    VALUES (_username, _password, _email)
    RETURNING id INTO new_user_id;  -- Capture the id of the new user

    RETURN new_user_id;

    EXCEPTION
        WHEN unique_violation THEN 
            RAISE EXCEPTION 'Email already exists.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
END;
$$;

-- Update
CREATE OR REPLACE FUNCTION update_user(
    _id integer,
    _username varchar,
    _password varchar,
    _email varchar
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "user"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No user found with id %.', _id;
    END IF;

    UPDATE "user"
    SET username = _username, password = _password, email = _email
    WHERE id = _id;

    RETURN _id;

    EXCEPTION
        WHEN unique_violation THEN 
            RAISE EXCEPTION 'Email already exists.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
END;
$$;

-- Delete
CREATE OR REPLACE FUNCTION delete_user(
    _id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "user"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No user found with id %.', _id;
    END IF;

    DELETE FROM "user"
    WHERE id = _id;

    RETURN _id;
END;
$$;