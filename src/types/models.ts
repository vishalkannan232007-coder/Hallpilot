export interface College {
  id: string;
  name: string;
  code: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  logo_url?: string | null;
  is_active: boolean;
  default_retention_hours: number;
}

export interface ExamSession {
  id: string;
  college_id: string;
  session_date: string;
  session_slot: 'FN' | 'AN';
  title: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'published' | 'archived';
  expires_at: string;
  published_at?: string | null;
}

export interface StudentSeatingResult {
  session_id: string;
  session_title: string;
  session_date: string;
  session_slot: string;
  start_time: string;
  end_time: string;
  hall_number: string;
  seat_number?: string | null;
  building_name?: string | null;
  floor_number?: string | null;
  course_code?: string | null;
  course_name?: string | null;
  special_instructions?: string | null;
  college_name: string;
  college_code: string;
}

export interface SearchState {
  collegeId: string;
  registerNumber: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  collegeId: string;
  collegeName: string;
  collegeCode: string;
  role: 'owner' | 'admin' | 'coordinator' | 'viewer';
}
