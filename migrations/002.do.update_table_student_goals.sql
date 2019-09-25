ALTER TABLE student_goals 
  ADD feedback int CHECK (feedback >= 1 and feedback <= 3)