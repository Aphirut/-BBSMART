
import { Role, ViewType, MenuSection, Student, User, Subject, SubjectType, GraduationCriteria, VideoMaterial } from './types';
import { 
  Database, 
  FileText, 
  UploadCloud, 
  Users, 
  GraduationCap, 
  ClipboardList, 
  FileBarChart,
  BookOpen,
  MonitorPlay,
  PenTool,
  Printer,
  Award,
  FileCheck,
  Search,
  Library,
  Compass,
  UserCircle,
  FileSpreadsheet,
  CalendarDays,
  Info,
  FilePenLine,
  UserCheck,
  Book,
  Video,
  MapPin,
  Calendar,
  Settings,
  Clock,
  Globe,
  Coffee,
  Landmark,
  ListChecks,
  CalendarCheck,
  FileQuestion
} from 'lucide-react';

export const MENU_STRUCTURE: MenuSection[] = [
  {
    title: "งานทะเบียน",
    roles: [Role.ADMIN_VIP, Role.ADMIN, Role.REGISTRAR],
    items: [
      { id: 'reg_basic', label: 'ข้อมูลพื้นฐาน', type: ViewType.FORM, icon: 'Database', color: 'blue' },
      { id: 'reg_curriculum', label: 'จัดการหลักสูตร', type: ViewType.CURRICULUM, icon: 'Settings', color: 'indigo' },
      { id: 'reg_info', label: 'ข้อมูลสารสนเทศ', type: ViewType.DASHBOARD, icon: 'FileBarChart', color: 'violet' },
      { id: 'reg_import', label: 'นำเข้า ITW51', type: ViewType.FORM, icon: 'UploadCloud', color: 'cyan' },
      { id: 'reg_teachers', label: 'จัดการผู้ใช้งาน/ครู', type: ViewType.TABLE_LIST, icon: 'Users', color: 'sky' },
      { id: 'reg_students', label: 'ข้อมูลนักศึกษา', type: ViewType.TABLE_LIST, icon: 'GraduationCap', color: 'blue' },
      { id: 'reg_enrollment', label: 'ลงทะเบียนเรียน', type: ViewType.ENROLLMENT, icon: 'ListChecks', color: 'emerald' },
      { id: 'reg_grades', label: 'ผลการเรียน', type: ViewType.TABLE_LIST, icon: 'FileSpreadsheet', color: 'teal' }, 
      { id: 'reg_kpch', label: 'บันทึก กพช.', type: ViewType.KPCH, icon: 'Clock', color: 'orange' },
      { id: 'reg_meeting', label: 'รายงานการพบกลุ่ม', type: ViewType.MEETING_REPORT, icon: 'CalendarDays', color: 'rose' },
    ]
  },
  {
    title: "งานครูผู้สอน",
    roles: [Role.ADMIN_VIP, Role.ADMIN, Role.TEACHER],
    items: [
      { id: 't_basic', label: 'ข้อมูลพื้นฐาน', type: ViewType.FORM, icon: 'Info', roles: [Role.ADMIN, Role.ADMIN_VIP], color: 'blue' },
      { id: 't_students', label: 'ข้อมูลนักศึกษา', type: ViewType.TABLE_LIST, icon: 'GraduationCap', color: 'indigo' },
      { id: 't_enrollment', label: 'ลงทะเบียนเรียน', type: ViewType.ENROLLMENT, icon: 'ListChecks', color: 'emerald' },
      { id: 't_online_class', label: 'ห้องเรียนออนไลน์', type: ViewType.ONLINE_CLASSROOM, icon: 'MonitorPlay', color: 'pink' },
      { id: 't_record_after', label: 'บันทึกหลังสอน', type: ViewType.FORM, icon: 'FilePenLine', color: 'amber' },
      { id: 't_grades', label: 'ผลการเรียน', type: ViewType.TABLE_LIST, icon: 'ClipboardList', color: 'teal' },
      { id: 't_moral', label: 'ประเมินคุณธรรม', type: ViewType.FORM, icon: 'Award', color: 'purple' },
      { id: 't_nfe4', label: 'กศน.4', type: ViewType.TABLE_LIST, icon: 'FileText', color: 'fuchsia' },
      { id: 't_kpch', label: 'บันทึก กพช.', type: ViewType.KPCH, icon: 'Clock', color: 'orange' },
      { id: 't_meeting', label: 'รายงานการพบกลุ่ม', type: ViewType.MEETING_REPORT, icon: 'CalendarDays', color: 'rose' },
      { id: 't_screening', label: 'คัดกรองผู้เรียน', type: ViewType.FORM, icon: 'UserCheck', color: 'cyan' },
      { id: 't_textbooks', label: 'หนังสือเรียน', type: ViewType.CONTENT, icon: 'Book', color: 'red' },
      { id: 't_media', label: 'สื่อการสอน', type: ViewType.CONTENT, icon: 'Video', color: 'rose' },
      { id: 't_resources', label: 'แหล่งเรียนรู้', type: ViewType.LEARNING_RESOURCE, icon: 'Landmark', color: 'green' },
      { id: 't_guidance', label: 'สอบกลางภาค', type: ViewType.CONTENT, icon: 'FileQuestion', color: 'violet' },
    ]
  },
  {
    title: "สำหรับนักศึกษา",
    roles: [Role.STUDENT],
    items: [
      { id: 's_dashboard', label: 'ข้อมูลส่วนตัว', type: ViewType.DASHBOARD, icon: 'UserCircle', color: 'blue' },
      { id: 's_enrolled_courses', label: 'วิชาที่ลงทะเบียน', type: ViewType.TABLE_LIST, icon: 'BookOpen', color: 'emerald' },
      { id: 's_scores', label: 'ตรวจสอบผลการเรียน', type: ViewType.TRANSCRIPT, icon: 'ClipboardList', color: 'indigo' },
      { id: 's_kpch', label: 'บันทึก กพช.', type: ViewType.KPCH, icon: 'Clock', color: 'orange' },
      { id: 's_classroom', label: 'ห้องเรียน/สอบ', type: ViewType.ONLINE_CLASSROOM, icon: 'MonitorPlay', color: 'pink' },
      { id: 's_textbooks', label: 'หนังสือเรียน', type: ViewType.CONTENT, icon: 'Book', color: 'red' },
      { id: 's_media', label: 'สื่อการสอน', type: ViewType.CONTENT, icon: 'Video', color: 'rose' },
      { id: 's_resources', label: 'แหล่งเรียนรู้', type: ViewType.LEARNING_RESOURCE, icon: 'Landmark', color: 'green' },
    ]
  },
  {
    title: "ข้อมูลทั่วไป",
    roles: [Role.ADMIN_VIP, Role.ADMIN, Role.TEACHER, Role.STUDENT],
    items: [
      { id: 'gen_exam_schedule', label: 'ตารางสอบ', type: ViewType.EXAM_SCHEDULE, icon: 'CalendarCheck', color: 'fuchsia' },
      { id: 'gen_personnel', label: 'ทำเนียบบุคลากร', type: ViewType.TABLE_LIST, icon: 'Users', color: 'sky' },
      { id: 'gen_website', label: 'เว็บไซต์ สกร.', type: ViewType.CONTENT, icon: 'Globe', color: 'blue' },
      { id: 'gen_relax', label: 'สถานที่พบกลุ่ม', type: ViewType.CONTENT, icon: 'MapPin', color: 'lime' },
      { id: 'gen_resources', label: 'แหล่งเรียนรู้', type: ViewType.LEARNING_RESOURCE, icon: 'Landmark', color: 'green' },
    ]
  }
];

export const getSemesters = (): string[] => ['1/2568', '2/2568', '1/2567', '2/2566', '1/2566'];

// Helper to extract Semester from ID
export const getSemesterFromId = (id: string): string => {
  if (!id || id.length < 3) return '';
  const yearStr = id.substring(0, 2); // '67'
  const termStr = id.substring(2, 3); // '1'
  return `${termStr}/25${yearStr}`;   // '1/2567'
};

// Helper to classify grade based on ID
export const getLevelFromId = (id: string): string => {
  if (!id || id.length < 4) return 'ไม่ระบุ';
  const levelDigit = id.charAt(3); // 4th digit
  if (levelDigit === '1') return 'ประถม';
  if (levelDigit === '2') return 'ม.ต้น';
  if (levelDigit === '3') return 'ม.ปลาย';
  return 'ไม่ระบุ';
};

// Helper to format date to Thai format (d MMMM yyyy)
export const formatThaiDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'buddhist' // Explicitly set to Buddhist calendar
  });
};

// Helper to calculate age from birthdate
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0;
  
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Updated: Parse YouTube URL for Video ID or Playlist ID
export const parseYouTubeUrl = (url: string): { id: string, type: 'video' | 'playlist' } | null => {
  if (!url) return null;
  const listMatch = url.match(/[?&]list=([^#&?]+)/);
  if (listMatch) {
    return { id: listMatch[1], type: 'playlist' };
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
     return { id: match[2], type: 'video' };
  }
  return null;
};

export const getYouTubeId = (url: string): string | null => {
    const res = parseYouTubeUrl(url);
    return res ? res.id : null;
}

// --- CLEANED MOCK DATA ---
// Returning empty arrays to remove all mock data as requested.

export const getMockUsers = (): User[] => [];

export const getMockSubjects = (): Subject[] => [];

export const getMockStudents = (): Student[] => [];

export const getMockVideos = (): VideoMaterial[] => [];

export const getDefaultCriteria = (): GraduationCriteria[] => [
  { 
    level: 'ประถม', 
    minTotalCredits: 48,
    minCompulsoryCredits: 36,
    minElectiveCredits: 12,
    minActivityHours: 200 
  },
  { 
    level: 'ม.ต้น', 
    minTotalCredits: 56,
    minCompulsoryCredits: 40,
    minElectiveCredits: 16,
    minActivityHours: 200 
  },
  { 
    level: 'ม.ปลาย', 
    minTotalCredits: 76,
    minCompulsoryCredits: 44,
    minElectiveCredits: 32,
    minActivityHours: 200 
  }
];
