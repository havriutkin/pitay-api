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
    fk_lesson_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "question" WHERE id = _id) THEN
        RAISE EXCEPTION 'No questions found with id %.', _id;
    END IF;

    RETURN QUERY
    SELECT id, question, is_answered as isAnswered, fk_lesson_id as lessonId
    FROM "question"
    WHERE id = _id;
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
    fk_lesson_id integer
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "question" WHERE fk_lesson_id = _lesson_id) THEN
        RAISE EXCEPTION 'No questions found with lesson id %.', _lesson_id;
    END IF;

    RETURN QUERY
    SELECT id, question, is_answered as isAnswered, fk_lesson_id as lessonId
    FROM "question"
    WHERE fk_lesson_id = _lesson_id;
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
    VALUES (_question, False, _lesson_id)
    RETURNING id INTO new_question_id;

    RETURN new_question_id;

    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE EXCEPTION 'Lesson not found.';
        WHEN not_null_violation THEN
            RAISE EXCEPTION 'Not enough data.';
END;
$$;