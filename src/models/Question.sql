CREATE TABLE question(
    id SERIAL PRIMARY KEY,
    question text NOT NULL,
    is_answered boolean NOT NULL,
    fk_lesson_id integer NOT NULL REFERENCES "lesson" (id)
);

-- Get by id
CREATE OR REPLACE FUNCTION get_question_by_id (
    _id integer
)
RETURNS TABLE(
    id integer,
    question text,
    is_answered boolean,
    lesson_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT q.id, q.question, q.is_answered as isAnswered, q.fk_lesson_id as lessonId
    FROM "question" q
    WHERE q.id = _id;
END;
$$;

-- Get by lesson id
CREATE OR REPLACE FUNCTION get_question_by_lesson_id (
    _lesson_id integer
)
RETURNS TABLE(
    id integer,
    question text,
    is_answered boolean,
    lesson_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT q.id, q.question, q.is_answered as isAnswered, q.fk_lesson_id as lessonId
    FROM "question" q
    WHERE q.fk_lesson_id = _lesson_id;
END;
$$;

-- Insert
CREATE OR REPLACE FUNCTION insert_question(
    _question text,
    _lesson_id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    new_question_id integer;
BEGIN
    INSERT INTO "question" (question, is_answered, fk_lesson_id)
    VALUES (_question, FALSE, _lesson_id)
    RETURNING id INTO new_question_id;

    RETURN new_question_id;

    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'Lesson not found.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
END;
$$;

-- Update
CREATE OR REPLACE FUNCTION update_question(
    _id integer,
    _question text,
    _is_answered boolean,
    _lesson_id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "question"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No question found with id %.', _id;
    END IF;

    UPDATE "question"
    SET question = _question, is_answered = _is_answered, fk_lesson_id = _lesson_id
    WHERE id = _id;

    RETURN _id;

    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'Lesson not found.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
END;
$$;

-- Delete
CREATE OR REPLACE FUNCTION delete_question(
    _id integer
)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "question"  WHERE id = _id) THEN
        RAISE EXCEPTION 'No question found with id %.', _id;
    END IF;

    DELETE FROM "question"
    WHERE id = _id;

    RETURN _id;
END;
$$;