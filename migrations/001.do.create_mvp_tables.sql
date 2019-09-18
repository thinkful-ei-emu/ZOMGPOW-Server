CREATE TABLE teachers (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  date_created  TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified  TIMESTAMPTZ
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  class_title VARCHAR NOT NULL,
  classcode INTEGER NOT NULL,
  teacher_id INTEGER
    REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  date_created  TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified  TIMESTAMPTZ
);

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  class_id INTEGER NOT NULL
    REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  date_created  TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified  TIMESTAMPTZ
);

CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL
    REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  goal_title VARCHAR,
  goal_description TEXT,
  date_created  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deadline  TIMESTAMPTZ,
  date_completed TIMESTAMPTZ
);

CREATE TABLE student_goals (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL
    REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id INTEGER NOT NULL
    REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  goal_id INTEGER NOT NULL
    REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  isComplete boolean
)

CREATE TABLE subgoals (
  id SERIAL PRIMARY KEY,
  student_goal_id INTEGER NOT NULL
    REFERENCES student_goals(id) ON DELETE CASCADE NOT NULL,
  goal_title VARCHAR,
  goal_description TEXT,
  date_created  TIMESTAMPTZ NOT NULL DEFAULT now(),
  isComplete boolean
);