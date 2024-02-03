-- Extension for generating random unique identifiers (keys for lesson)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE lesson(
    id SERIAL PRIMARY KEY,
    title varchar(60) NOT NULL,
    private_key varchar NOT NULL UNIQUE,
    public_key varchar NOT NULL UNIQUE,
    fk_owner_id integer NOT NULL REFERENCES "user" (id)     
);


-- Get by id 
CREATE OR REPLACE FUNCTION get_lesson_by_id(
    _id integer
)
RETURNS TABLE(
    id integer,
    title varchar(60),
    private_key varchar,
    public_key varchar,
    owner_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT l.id, l.title, l.private_key AS privateKey, l.public_key AS publicKey, l.fk_owner_id AS ownerId
    FROM "lesson" l
    WHERE l.id = _id;
END;
$$;


-- Get by Public Key
CREATE OR REPLACE FUNCTION get_lesson_by_public_key(
    _public_key varchar
)
RETURNS TABLE(
    id integer,
    title varchar(60),
    private_key varchar,
    public_key varchar,
    owner_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT l.id, l.title, l.private_key AS privateKey, l.public_key AS publicKey, l.fk_owner_id AS ownerId
    FROM "lesson" l
    WHERE l.public_key = _public_key;
END;
$$;


-- Get by owner id 
CREATE OR REPLACE FUNCTION get_lesson_by_owner_id(
    _owner_id integer
)
RETURNS TABLE(
    id integer,
    title varchar(60),
    private_key varchar,
    public_key varchar,
    owner_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT l.id, l.title, l.private_key AS privateKey, l.public_key AS publicKey, l.fk_owner_id AS ownerId
    FROM "lesson" l
    WHERE l.fk_owner_id = _owner_id;
END;
$$;


-- Insert
CREATE OR REPLACE FUNCTION insert_lesson(
    _title varchar(60),
    _fk_owner_id integer
)
RETURNS varchar
LANGUAGE plpgsql
AS $$
DECLARE
    new_public_key varchar;    
BEGIN
    -- Insert the new lesson data into the lesson table
    INSERT INTO "lesson" (title, private_key, public_key, fk_owner_id)
    VALUES (_title, uuid_generate_v4(), uuid_generate_v4(), _fk_owner_id)
    RETURNING public_key INTO new_public_key; 

    RETURN new_public_key;

    EXCEPTION
        WHEN unique_violation THEN 
            RAISE EXCEPTION 'Key already exists.';
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'Owner not found.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
        WHEN string_data_right_truncation THEN
            RAISE EXCEPTION 'Title is too long.';
END;
$$;

-- Update
CREATE OR REPLACE FUNCTION update_lesson(
    _id integer,
    _title varchar(60)
)
RETURNS varchar
LANGUAGE plpgsql
AS $$
DECLARE
    _public_key varchar; 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "lesson"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No lesson found with id %.', _id;
    END IF;

    UPDATE "lesson"
    SET title = _title
    WHERE id = _id
    RETURNING public_key INTO _public_key;

    RETURN _public_key;

    EXCEPTION
        WHEN unique_violation THEN 
            RAISE EXCEPTION 'Key already exists.';
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'Owner not found.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
        WHEN string_data_right_truncation THEN
            RAISE EXCEPTION 'Title is too long.';
END;
$$;

-- Delete
CREATE OR REPLACE FUNCTION delete_lesson(
    _id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "lesson"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No lesson found with id %.', _id;
    END IF;

    DELETE FROM "lesson"
    WHERE id = _id;

    RETURN _id;
END;
$$;