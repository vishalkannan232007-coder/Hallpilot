export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      colleges: {
        Row: {
          id: string
          name: string
          code: string
          slug: string
          city: string | null
          state: string | null
          logo_url: string | null
          is_active: boolean
          default_retention_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          slug: string
          city?: string | null
          state?: string | null
          logo_url?: string | null
          is_active?: boolean
          default_retention_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          slug?: string
          city?: string | null
          state?: string | null
          logo_url?: string | null
          is_active?: boolean
          default_retention_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          is_platform_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          is_platform_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          is_platform_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      college_memberships: {
        Row: {
          id: string
          user_id: string
          college_id: string
          role: 'owner' | 'admin' | 'coordinator' | 'viewer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          college_id: string
          role?: 'owner' | 'admin' | 'coordinator' | 'viewer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          college_id?: string
          role?: 'owner' | 'admin' | 'coordinator' | 'viewer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exam_sessions: {
        Row: {
          id: string
          college_id: string
          session_date: string
          session_slot: 'FN' | 'AN'
          title: string
          start_time: string
          end_time: string
          status: 'draft' | 'published' | 'archived'
          expires_at: string
          published_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          college_id: string
          session_date: string
          session_slot: 'FN' | 'AN'
          title: string
          start_time: string
          end_time: string
          status?: 'draft' | 'published' | 'archived'
          expires_at: string
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          college_id?: string
          session_date?: string
          session_slot?: 'FN' | 'AN'
          title?: string
          start_time?: string
          end_time?: string
          status?: 'draft' | 'published' | 'archived'
          expires_at?: string
          published_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seating_allocations: {
        Row: {
          id: string
          college_id: string
          session_id: string
          register_number: string
          student_name: string | null
          course_code: string | null
          course_name: string | null
          hall_number: string
          seat_number: string | null
          building_name: string | null
          floor_number: string | null
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          college_id: string
          session_id: string
          register_number: string
          student_name?: string | null
          course_code?: string | null
          course_name?: string | null
          hall_number: string
          seat_number?: string | null
          building_name?: string | null
          floor_number?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          college_id?: string
          session_id?: string
          register_number?: string
          student_name?: string | null
          course_code?: string | null
          course_name?: string | null
          hall_number?: string
          seat_number?: string | null
          building_name?: string | null
          floor_number?: string | null
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      lookup_student_seating: {
        Args: {
          p_college_id: string
          p_register_number: string
        }
        Returns: {
          session_id: string
          session_title: string
          session_date: string
          session_slot: string
          start_time: string
          end_time: string
          hall_number: string
          seat_number: string | null
          building_name: string | null
          floor_number: string | null
          course_code: string | null
          course_name: string | null
          special_instructions: string | null
          college_name: string
          college_code: string
        }[]
      }
    }
  }
}
