import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { College, StudentSeatingResult } from '@/types/models';
import { MOCK_COLLEGES, MOCK_STUDENT_RESULTS } from '@/lib/mockData';

export async function getActiveColleges(): Promise<College[]> {
  if (!isSupabaseConfigured) {
    return MOCK_COLLEGES;
  }

  try {
    const { data, error } = await supabase
      .from('colleges')
      .select('id, name, code, slug, city, state, logo_url, is_active, default_retention_hours')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Falling back to mock colleges due to error:', error.message);
      return MOCK_COLLEGES;
    }

    return (data as College[]) || MOCK_COLLEGES;
  } catch (err) {
    console.warn('Network error fetching colleges, using mock fallback:', err);
    return MOCK_COLLEGES;
  }
}

export async function lookupStudentSeating(
  collegeId: string,
  registerNumber: string
): Promise<StudentSeatingResult[]> {
  const sanitizedRegNo = registerNumber.trim();
  if (!collegeId || !sanitizedRegNo) {
    return [];
  }

  if (!isSupabaseConfigured) {
    // Artificial slight delay to simulate realistic network request
    await new Promise((resolve) => setTimeout(resolve, 350));
    const lookupKey = `${collegeId}_${sanitizedRegNo.toLowerCase()}`;
    return MOCK_STUDENT_RESULTS[lookupKey] || [];
  }

  try {
    // Invoke the restricted security-definer RPC function
    // Students NEVER select * from seating_allocations table directly!
    const { data, error } = await (supabase.rpc as any)('lookup_student_seating', {
      p_college_id: collegeId,
      p_register_number: sanitizedRegNo,
    });

    if (error) {
      console.error('RPC lookup error:', error.message);
      throw new Error(error.message);
    }

    return (data as unknown as StudentSeatingResult[]) || [];
  } catch (err) {
    console.error('Exception during seating lookup:', err);
    throw err;
  }
}
