-- ==============================================================================
-- HallPilot Seed Data: supabase/seed.sql
-- Note: Contains STRICTLY FICTIONAL sample records for local development & testing.
-- No real student register numbers or PII are ever included.
-- ==============================================================================

-- 1. Insert Fictional Colleges
INSERT INTO public.colleges (id, name, code, slug, city, state, default_retention_hours)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Apex Institute of Technology', 'AIT', 'apex-institute', 'Metropolis', 'State of Tech', 24),
    ('22222222-2222-2222-2222-222222222222', 'Beacon College of Engineering', 'BCE', 'beacon-engineering', 'New Alexandria', 'State of Tech', 36),
    ('33333333-3333-3333-3333-333333333333', 'Crestview Polytechnic', 'CVP', 'crestview-polytechnic', 'Riverdale', 'Central State', 12)
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Fictional Active Exam Sessions
INSERT INTO public.exam_sessions (id, college_id, session_date, session_slot, title, start_time, end_time, status, expires_at)
VALUES 
    (
        '44444444-4444-4444-4444-444444444444',
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE,
        'FN',
        'Semester End Theory Examinations - Session 1',
        '09:30:00',
        '12:30:00',
        'published',
        NOW() + INTERVAL '24 hours'
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE,
        'AN',
        'Semester End Theory Examinations - Session 2',
        '14:00:00',
        '17:00:00',
        'published',
        NOW() + INTERVAL '28 hours'
    )
ON CONFLICT DO NOTHING;

-- 3. Insert Fictional Seating Allocations (Demonstrating Preserved Leading Zeros)
INSERT INTO public.seating_allocations 
    (college_id, session_id, register_number, student_name, course_code, course_name, hall_number, seat_number, building_name, floor_number, special_instructions)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444',
        '004101',
        'Sample Candidate A',
        'CS8501',
        'Database Management Systems',
        'LH-101',
        'A-01',
        'Science & Tech Block',
        '1st Floor',
        'Non-programmable calculator allowed. Report 15 minutes before exam start.'
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444',
        '004102',
        'Sample Candidate B',
        'CS8501',
        'Database Management Systems',
        'LH-101',
        'A-02',
        'Science & Tech Block',
        '1st Floor',
        'Non-programmable calculator allowed. Report 15 minutes before exam start.'
    ),
    (
        '11111111-1111-1111-1111-111111111111',
        '44444444-4444-4444-4444-444444444444',
        '09CS102',
        'Sample Candidate C',
        'EC3402',
        'Digital Signal Processing',
        'AUD-01',
        'S-15',
        'Main Auditorium',
        'Ground Floor',
        'Electronic devices strictly prohibited. Hall gates close at 09:25 AM.'
    )
ON CONFLICT DO NOTHING;
