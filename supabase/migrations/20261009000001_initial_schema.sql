-- ==============================================================================
-- HallPilot Schema Migration: 20261009000001_initial_schema.sql
-- Description: Core tables, constraints, indexes, Row Level Security (RLS) policies,
--              and restricted anti-scraping RPC function for HallPilot.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- 2.1 COLLEGES TABLE
-- Educational institutions onboarded to HallPilot
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    city TEXT,
    state TEXT,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    default_retention_hours INTEGER NOT NULL DEFAULT 24 CHECK (default_retention_hours >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 PROFILES TABLE (Associated with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    is_platform_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 COLLEGE MEMBERSHIPS / ADMINS TABLE
-- Connects a profile/user to a specific tenant college with specific RBAC roles
CREATE TABLE IF NOT EXISTS public.college_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'coordinator', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_college UNIQUE (user_id, college_id)
);

-- 2.4 EXAM SESSIONS TABLE
-- Represents specific examination dates and slots (e.g., 2026-11-14 FN)
CREATE TABLE IF NOT EXISTS public.exam_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    session_slot TEXT NOT NULL CHECK (session_slot IN ('FN', 'AN')),
    title TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    expires_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_college_session_slot UNIQUE (college_id, session_date, session_slot, title)
);

-- 2.5 SEATING ALLOCATIONS TABLE
-- High-volume seating roster. TEXT is strictly used for register_number to preserve leading zeros.
CREATE TABLE IF NOT EXISTS public.seating_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    register_number TEXT NOT NULL,
    student_name TEXT, -- Optional display name / initials
    course_code TEXT,
    course_name TEXT,
    hall_number TEXT NOT NULL,
    seat_number TEXT,
    building_name TEXT,
    floor_number TEXT,
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_session_register UNIQUE (session_id, register_number)
);

-- 2.6 UPLOAD BATCHES TABLE
-- Ingestion audit trail, tracking total records, staging errors, and publication history
CREATE TABLE IF NOT EXISTS public.upload_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    total_rows INTEGER NOT NULL DEFAULT 0,
    valid_rows INTEGER NOT NULL DEFAULT 0,
    error_rows INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'staged' CHECK (status IN ('staged', 'published', 'cancelled')),
    validation_summary JSONB DEFAULT '{}'::jsonb,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 AUDIT LOGS TABLE
-- Security event logging for compliance and tenant accountability
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'session.create', 'seating.publish', 'session.expire'
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================

-- B-tree lookup on college and register number for sub-10ms student search
CREATE INDEX IF NOT EXISTS idx_seating_alloc_search 
    ON public.seating_allocations (college_id, register_number, session_id);

-- Session filtering by status and expiry timestamp
CREATE INDEX IF NOT EXISTS idx_sessions_active 
    ON public.exam_sessions (college_id, status, expires_at);

-- College membership resolution for fast RLS policy checks
CREATE INDEX IF NOT EXISTS idx_memberships_user_college 
    ON public.college_memberships (user_id, college_id);

CREATE INDEX IF NOT EXISTS idx_audit_college_time 
    ON public.audit_logs (college_id, created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on every table
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seating_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upload_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4.1 Helper function to resolve the current user's authenticated college_id
CREATE OR REPLACE FUNCTION public.get_auth_college_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT college_id 
    FROM public.college_memberships 
    WHERE user_id = auth.uid() AND is_active = TRUE
    LIMIT 1;
$$;

-- 4.2 Helper function to check if current user is a platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (SELECT is_platform_admin FROM public.profiles WHERE id = auth.uid()),
        FALSE
    );
$$;

-- ------------------------------------------------------------------------------
-- POLICIES: COLLEGES
-- ------------------------------------------------------------------------------
-- Public/Student can see active colleges to populate the college selector
CREATE POLICY "Public can view active colleges"
    ON public.colleges FOR SELECT
    TO anon, authenticated
    USING (is_active = TRUE);

-- College Admins can update their own college details
CREATE POLICY "Admins can update their own college"
    ON public.colleges FOR UPDATE
    TO authenticated
    USING (id = public.get_auth_college_id() OR public.is_platform_admin())
    WITH CHECK (id = public.get_auth_college_id() OR public.is_platform_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: PROFILES
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid() OR public.is_platform_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ------------------------------------------------------------------------------
-- POLICIES: COLLEGE MEMBERSHIPS
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins view colleagues in same college"
    ON public.college_memberships FOR SELECT
    TO authenticated
    USING (college_id = public.get_auth_college_id() OR public.is_platform_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: EXAM SESSIONS
-- ------------------------------------------------------------------------------
-- Public can only view published, unexpired sessions
CREATE POLICY "Public can view active published sessions"
    ON public.exam_sessions FOR SELECT
    TO anon, authenticated
    USING (status = 'published' AND expires_at > now());

-- College admins have full CRUD over their own college's sessions
CREATE POLICY "Admins manage own exam sessions"
    ON public.exam_sessions FOR ALL
    TO authenticated
    USING (college_id = public.get_auth_college_id() OR public.is_platform_admin())
    WITH CHECK (college_id = public.get_auth_college_id() OR public.is_platform_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: SEATING ALLOCATIONS
-- CRITICAL SECURITY REQUIREMENT:
-- Students / Public (anon) HAVE NO DIRECT SELECT PERMISSION.
-- Direct queries like supabase.from('seating_allocations').select('*') are FORBIDDEN!
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage own college seating allocations"
    ON public.seating_allocations FOR ALL
    TO authenticated
    USING (college_id = public.get_auth_college_id() OR public.is_platform_admin())
    WITH CHECK (college_id = public.get_auth_college_id() OR public.is_platform_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: UPLOAD BATCHES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins manage own upload batches"
    ON public.upload_batches FOR ALL
    TO authenticated
    USING (college_id = public.get_auth_college_id() OR public.is_platform_admin())
    WITH CHECK (college_id = public.get_auth_college_id() OR public.is_platform_admin());

-- ------------------------------------------------------------------------------
-- POLICIES: AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins view own college audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (college_id = public.get_auth_college_id() OR public.is_platform_admin());

CREATE POLICY "System insert audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (college_id = public.get_auth_college_id() OR public.is_platform_admin());

-- ==============================================================================
-- 5. RESTRICTED ANTI-SCRAPING PUBLIC LOOKUP FUNCTION (RPC)
-- ==============================================================================
-- This is the ONLY mechanism by which students access seating info.
-- Requires exact pair of (college_id, register_number).
-- Returns strictly unexpired, published sessions with minimal necessary fields.
CREATE OR REPLACE FUNCTION public.lookup_student_seating(
    p_college_id UUID,
    p_register_number TEXT
)
RETURNS TABLE (
    session_id UUID,
    session_title TEXT,
    session_date DATE,
    session_slot TEXT,
    start_time TIME,
    end_time TIME,
    hall_number TEXT,
    seat_number TEXT,
    building_name TEXT,
    floor_number TEXT,
    course_code TEXT,
    course_name TEXT,
    special_instructions TEXT,
    college_name TEXT,
    college_code TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. Input sanitization: Trim whitespace
    p_register_number := TRIM(p_register_number);
    
    -- Guard clause: require valid parameters
    IF p_register_number IS NULL OR p_register_number = '' OR p_college_id IS NULL THEN
        RETURN;
    END IF;

    -- 2. Exact match query
    RETURN QUERY
    SELECT 
        s.id AS session_id,
        s.title AS session_title,
        s.session_date,
        s.session_slot,
        s.start_time,
        s.end_time,
        sa.hall_number,
        sa.seat_number,
        sa.building_name,
        sa.floor_number,
        sa.course_code,
        sa.course_name,
        sa.special_instructions,
        c.name AS college_name,
        c.code AS college_code
    FROM public.seating_allocations sa
    INNER JOIN public.exam_sessions s ON s.id = sa.session_id
    INNER JOIN public.colleges c ON c.id = sa.college_id
    WHERE sa.college_id = p_college_id
      AND LOWER(sa.register_number) = LOWER(p_register_number)
      AND s.status = 'published'
      AND s.expires_at > NOW()
      AND c.is_active = TRUE
    ORDER BY s.session_date ASC, s.start_time ASC;
END;
$$;

-- Grant execution to public anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.lookup_student_seating(UUID, TEXT) TO anon, authenticated;
