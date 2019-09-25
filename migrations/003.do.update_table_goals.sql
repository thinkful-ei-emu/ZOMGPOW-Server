ALTER TABLE goals
  ADD exit_ticket_type TEXT,
  ADD exit_ticket_question TEXT,
  ADD exit_ticket_options TEXT ARRAY[4],
  ADD exit_ticket_correct_answer VARCHAR