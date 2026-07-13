IF COL_LENGTH('sessoes', 'link_reuniao') IS NULL
BEGIN
    ALTER TABLE sessoes ADD link_reuniao VARCHAR(255) NULL;
END;

IF COL_LENGTH('sessoes', 'google_event_id') IS NULL
BEGIN
    ALTER TABLE sessoes ADD google_event_id VARCHAR(255) NULL;
END;
