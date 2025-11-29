
export enum Role {
  ADMIN_VIP = 'ADMIN_VIP', // ผู้ดูแลระบบสูงสุด
  ADMIN = 'ADMIN',
  REGISTRAR = 'REGISTRAR', // Treated as Admin for this context or specific staff
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  TABLE_LIST = 'TABLE_LIST',
  // AI_GENERATOR removed
  FORM = 'FORM',
  CONTENT = 'CONTENT',
  PROFILE = 'PROFILE',
  CURRICULUM = 'CURRICULUM',
  KPCH = 'KPCH', // New view type for Activity Scores
  TRANSCRIPT = 'TRANSCRIPT', // New view type for Grade Report
  MEETING_REPORT = 'MEETING_REPORT', // New view type for Group Meeting
  MEETING_PLACE = 'MEETING_PLACE', // New view type for Meeting Places Management
  LEARNING_RESOURCE = 'LEARNING_RESOURCE', // New view type for Learning Resources
  ONLINE_CLASSROOM = 'ONLINE_CLASSROOM', // New view type for Google Classroom links
  ENROLLMENT = 'ENROLLMENT', // New view type for Subject Enrollment
  EXAM_SCHEDULE = 'EXAM_SCHEDULE', // New view type for Final Exam Schedule
}

export enum SubjectType {
  COMPULSORY = 'COMPULSORY', // วิชาบังคับ
  ELECTIVE = 'ELECTIVE'      // วิชาเลือก
}

export type ImportType = 'STUDENT' | 'GRADE' | 'ACTIVITY' | 'ADVISOR';

export interface Subject {
  id: string;
  code: string;
  name: string;
  type: SubjectType;
  credit: number;
  level: string; // 'ประถม', 'ม.ต้น', 'ม.ปลาย'
}

export interface GraduationCriteria {
  level: string;
  minTotalCredits: number;
  minCompulsoryCredits: number;
  minElectiveCredits: number;
  minActivityHours: number; // New field for KPCH
}

export interface MenuItem {
  id: string;
  label: string;
  type: ViewType;
  icon?: string;
  description?: string;
  roles?: Role[]; // Added optional roles for specific item access control
  color?: string; // Theme color for 3D buttons
}

export interface MenuSection {
  title: string;
  roles: Role[]; // Changed from single role to array to allow shared access
  items: MenuItem[];
}

export interface ActivityRecord {
  id: string;
  activityName: string;
  semester: string;
  hours: number;
  responsibleTeacher?: string; // New field
}

export interface EnrolledCourse {
  subjectId: string;
  grade: number | string; // Changed to support 'ม', 'ข'
  semester: string; // e.g. "1/2567"
}

export interface AdvisorHistory {
  semester: string;
  teacherId: string;
  teacherName?: string;
}

export interface VideoMaterial {
  id: string;
  title: string;
  url: string;
  videoId: string;
  videoType?: 'video' | 'playlist'; // Added to distinguish types
  addedBy: string;
  date: string;
}

export interface MeetingReport {
  id: string;
  date: string;
  topic: string;
  teacherId: string;
  teacherName: string;
  countPrimary: number;
  countJunior: number;
  countSenior: number;
  totalStudents: number;
  images: string[]; // Array of Base64 strings or URLs
  note?: string;
}

export interface TeachingRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  semester: string;
  times: number; // ครั้งที่
  date: string;
  topic: string; // หัวข้อ/วิชา
  
  // Content
  activities: string; // กิจกรรมการเรียนรู้
  outcomes: string;   // สิ่งที่ได้รับจากการเรียนรู้
  problems: string;   // สภาพปัญหาที่พบ
  solutions: string;  // วิธีการแก้ปัญหา
  suggestions: string;// ข้อเสนอแนะ

  // Director Part
  directorComments?: string;
  directorSignDate?: string;
  directorName?: string; // Fixed name usually, but good to store
}

export interface MeetingPlace {
  id: string;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  image?: string; // Base64 or URL
}

export interface LearningResource {
  id: string;
  name: string; // ชื่อแหล่งเรียนรู้
  type?: string; // ประเภท (ภูมิปัญญา, สถานที่, ฯลฯ)
  activities: string; // กิจกรรมในแหล่งเรียนรู้
  contactLocation: string; // สถานที่ติดต่อ
  contactName?: string; // ผู้ดูแล/วิทยากร
  contactTel?: string; // เบอร์โทร
  latitude?: string;
  longitude?: string;
  images: string[]; // รูปภาพหลายรูป
}

export interface OnlineClassroom {
  id: string;
  teacherId: string;
  subjectId: string;
  url: string; // Google Classroom URL
  name?: string; // Optional custom name
  platform?: 'Google Classroom' | 'Google Meet' | 'Line' | 'Other';
  semester?: string; // Linked Semester
  examLink?: string; // Midterm Exam Link
  guidelineLink?: string; // Final Exam Guideline Link
}

export interface Textbook {
  id: string;
  code: string;
  title: string;
  category: 'FULL' | 'SUMMARY'; // หนังสือเรียน | หนังสือสรุป
  level?: string; // ประถม / ม.ต้น / ม.ปลาย
  coverImage: string; // Base64 Image
  fileUrl: string; // PDF Base64 or URL
}

export interface ExamSchedule {
  id: string;
  semester: string;
  level: string; // 'ประถม', 'ม.ต้น', 'ม.ปลาย'
  fileUrl: string; // Base64 or URL
  description?: string;
}

export interface ExamSlot {
  id: string;
  subjectId: string;
  semester: string;
  examDate: string;
  examTime: string;
  examRoom?: string; // Online/Virtual Room
  physicalRoom?: string; // New: Physical Location
}

export interface Personnel {
  id: string;
  name: string;
  position: string;
  responsibility?: string;
  image?: string; // Base64
  orderIndex?: number;
}

export interface SubDistrictLink {
  id: string;
  name: string;
  url: string;     // Main Website
  facebook?: string; // Facebook Page URL
  line?: string;     // Line Add/Profile URL
}

export interface ContactInfo {
  website?: string;
  facebook?: string;
  lineId?: string;
  lineUrl?: string;
  affiliatedLinks?: SubDistrictLink[]; // New field for affiliated sites
}

export interface Student {
  id: string;
  citizenId?: string;   // เลขบัตรประชาชน
  phoneNumber?: string; // เบอร์โทรศัพท์
  
  // New Personal Details
  title: string;        // คำนำหน้าชื่อ
  firstName: string;    // ชื่อ
  middleName?: string;  // ชื่อกลาง
  lastName: string;     // นามสกุล
  gender: 1 | 2 | 3;    // 1 = ชาย, 2 = หญิง, 3 = พระ
  age: number;          // อายุ
  birthDate: string;    // วันเกิด (YYYY-MM-DD)

  // Academic Details
  grade: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  gpa: number;
  teacherId?: string; // Link to a teacher (Current Advisor)
  teacherName?: string; // Added for display purposes
  midtermScore?: number;
  finalScore?: number; // Added final score
  behaviorScore?: number;
  semester: string; // Current semester context
  
  enrolledCourses: EnrolledCourse[]; // Replaced passedSubjects with detailed history
  
  activities: ActivityRecord[]; // New field for KPCH records

  advisorHistory?: AdvisorHistory[]; // New field for tracking advisors per semester
}

export interface User {
  id: string;
  username: string;
  password?: string; // Added password for mock auth handling
  name: string;
  role: Role;
  avatar?: string;
}

export interface GeneratedContentState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
}

export interface ExamScore {
  studentId: string;
  score: number;
  totalPoints: number;
}

export interface MidtermExam {
  id: string;
  teacherId: string;
  subjectId: string;
  semester: string;
  examLink: string;
  guidelineLink?: string;
  scores?: ExamScore[];
  submittedStudentIds?: string[];
}
