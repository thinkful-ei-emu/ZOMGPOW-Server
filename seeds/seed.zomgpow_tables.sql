BEGIN;

TRUNCATE
  subgoals,
  student_goals,
  goals,
  classes,
  students,
  teachers
  RESTART IDENTITY CASCADE;

  INSERT INTO teachers (full_name, email, password)
  VALUES
  ('Dunder Mifflin', 'dunder@gmail.com', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'),
  ('Bodeep Deboop', 'Bo@gmail.com', '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'),
  ('Charlie Bloggs', 'Charlie@gmail.com', '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'),
  ('Sam Smith', 'Sam@gmail.com', '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.');

  INSERT INTO classes (class_title, classcode, teacher_id)
  VALUES
  ('Kindergarten', 4321, 1),
  ('1st Grade', 1234, 2),
  ('2nd Grade', 9876, 3),
  ('3rd Grade', 6789, 4);
  
  INSERT INTO students (user_name, full_name, class_id)
  VALUES
  ('sone', 'Student One', 1),
  ('stwo', 'Student Two', 1),
  ('sthree', 'Student Three', 1),
  ('sfour', 'Student Four', 1),
  ('sfive', 'Student Five', 2),
  ('ssix', 'Student Six', 2),
  ('s7', 'Student 7', 2),
  ('s8', 'Student 8', 2),
  ('s9', 'Student 9', 3),
  ('s10', 'Student 10', 3),
  ('s11', 'Student 11', 3),
  ('s12', 'Student 12', 3),
  ('s13', 'Student 13', 4),
  ('s14', 'Student 14', 4),
  ('s15', 'Student 15', 4),
  ('s16', 'Student 16', 4);
  
  INSERT INTO goals (class_id, goal_title, goal_description)
  VALUES
  (4, 'write a paragraph about your summer', 'write a story about the favorite thing you did during the summer'),
  (3, 'write a paragraph about your summer', 'write a story about the favorite thing you did during the summer'),
  (2, 'have fun with a rap battle', 'hey ho');
  
  INSERT INTO student_goals (class_id, student_id, goal_id)
  VALUES
  (4,16,1),
  (4,15,1),
  (4,14,1),
  (4,13,1),
  (3,12,1),
  (3,11,1),
  (3,10,1),
  (3,9,1),
  (2,7,1),
  (2,5,1);
  
  INSERT INTO subgoals (student_goal_id, subgoal_title, subgoal_description)
  VALUES
  (1, 'create an ideas list', 'write down some fun things you remember doing during the summer'),
  (4, 'create an ideas list', 'write down some fun things you remember doing during the summer'),
  (6, 'create an ideas list', 'write down some fun things you remember doing during the summer');

  COMMIT;