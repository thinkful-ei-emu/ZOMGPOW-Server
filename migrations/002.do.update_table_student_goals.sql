ALTER TABLE student_goals 
  ADD evaluation int CHECK (evaluation >= 1 and evaluation <= 3);

ALTER TABLE subgoals 
  ADD evaluation int CHECK (evaluation >= 1 and evaluation <=3);