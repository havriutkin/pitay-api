CREATE TABLE lesson(
    id SERIAL PRIMARY KEY,
    title varchar(20) NOT NULL,
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
    title varchar(20),
    private_key varchar,
    public_key varchar,
    fk_owner_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id, title, private_key AS privateKey, public_key AS publicKey, fk_owner_id AS fk_owner_id
    FROM "lesson"
    WHERE id = _id;
END;
$$;


-- Get by Public Key
CREATE OR REPLACE FUNCTION get_lesson_by_public_key(
    _public_key varchar
)
RETURNS TABLE(
    id integer,
    title varchar(20),
    private_key varchar,
    public_key varchar,
    fk_owner_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id, title, private_key AS privateKey, public_key AS publicKey, fk_owner_id AS fk_owner_id
    FROM "lesson"
    WHERE public_key = _public_key;
END;
$$;


-- Get by owner id 
CREATE OR REPLACE FUNCTION get_lesson_by_owner_id(
    _owner_id integer
)
RETURNS TABLE(
    id integer,
    title varchar(20),
    private_key varchar,
    public_key varchar,
    fk_owner_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id, title, private_key AS privateKey, public_key AS publicKey, fk_owner_id AS fk_owner_id
    FROM "lesson"
    WHERE fk_owner_id = _owner_id;
END;
$$;


-- Insert
CREATE OR REPLACE FUNCTION insert_lesson(
    _title varchar(20),
    _private_key varchar,
    _public_key varchar,
    _fk_owner_id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    new_lesson_id integer;    
BEGIN
    -- Insert the new lesson data into the lesson table
    INSERT INTO "lesson" (title, private_key, public_key, fk_owner_id)
    VALUES (_title, _private_key, _public_key, _fk_owner_id)
    RETURNING id INTO new_lesson_id;  -- Capture the id of the lesson

    RETURN new_lesson_id;

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
    _title varchar(20),
    _private_key varchar,
    _public_key varchar,
    _fk_owner_id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "lesson"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No lesson found with id %.', _id;
    END IF;

    UPDATE "lesson"
    SET title = _title, private_key = _private_key, public_key = _public_key, fk_owner_id = _fk_owner_id
    WHERE id = _id;

    RETURN _id;

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