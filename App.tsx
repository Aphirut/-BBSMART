
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Role, 
  ViewType, 
  User, 
  Student, 
  Subject, 
  GraduationCriteria, 
  MeetingReport, 
  MeetingPlace, 
  Personnel, 
  LearningResource, 
  ContactInfo, 
  VideoMaterial, 
  OnlineClassroom,
  ImportType,
  EnrolledCourse
} from './types';
import { MENU_STRUCTURE, getSemesters, getDefaultCriteria } from './constants';
import { api } from './services/api';

// Icons
import { 
  Menu, LogOut, User as UserIcon, Calendar, Bell, ChevronDown, 
  Home, Grid, Settings, Search, X
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DataTable from './components/DataTable';
import SettingsForm from './components/SettingsForm';
import CurriculumManager from './components/CurriculumManager';
import KpchTracker from './components/KpchTracker';
import ImportITW51 from './components/ImportITW51';
import ChangePasswordModal from './components/ChangePasswordModal';
import GradeReport from './components/GradeReport';
import AddSemesterModal from './components/AddSemesterModal';
import VideoManager from './components/VideoManager';
import InstallPrompt from './components/InstallPrompt';
import MeetingPlaceManager from './components/MeetingPlaceManager';
import ContactChannels from './components/ContactChannels';
import PersonnelManager from './components/PersonnelManager';
import LearningResourceManager from './components/LearningResourceManager';
import OnlineClassroomManager from './components/OnlineClassroom';
import PostTeachingRecord from './components/PostTeachingRecord';
import EnrollmentManager from './components/EnrollmentManager';
import MeetingReports from './components/MeetingReports';
import MidtermExamManager from './components/MidtermExamManager';
import TextbookManager from './components/TextbookManager';
import ExamScheduleManager from './components/ExamScheduleManager';

const App: React.FC = () => {
  // Auth & UI State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string>('');
  
  // Drill-down State
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  
  // Mobile Specific State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileTab, setMobileTab] = useState<'HOME' | 'MENU' | 'PROFILE'>('HOME');

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [videos, setVideos] = useState<VideoMaterial[]>([]);
  const [meetingReports, setMeetingReports] = useState<MeetingReport[]>([]);
  const [meetingPlaces, setMeetingPlaces] = useState<MeetingPlace[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [onlineClassrooms, setOnlineClassrooms] = useState<OnlineClassroom[]>([]);
  const [gradCriteria, setGradCriteria] = useState<GraduationCriteria[]>(getDefaultCriteria());
  
  // Settings State
  const [schoolName, setSchoolName] = useState('BBSMART PLUS');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [semesterList, setSemesterList] = useState<string[]>(getSemesters());
  const [currentSemester, setCurrentSemester] = useState<string>(getSemesters()[0]);

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Resize Listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset viewing state on menu change
  useEffect(() => {
    setViewingStudentId(null);
  }, [activeMenuId]);

  // Initial Data Load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [
          fetchedUsers, fetchedStudents, fetchedSubjects, fetchedVideos, 
          fetchedReports, fetchedPlaces, fetchedPersonnel, fetchedResources, 
          fetchedClassrooms, fetchedSettings
        ] = await Promise.all([
          api.get('/users'),
          api.get('/students'),
          api.get('/subjects'),
          api.get('/videos'),
          api.get('/reports'),
          api.get('/meeting-places'),
          api.get('/personnel'),
          api.get('/resources'),
          api.get('/classrooms'),
          api.get('/settings')
        ]);

        if (fetchedUsers) setUsers(fetchedUsers);
        if (fetchedStudents) setStudents(fetchedStudents);
        if (fetchedSubjects) setSubjects(fetchedSubjects);
        if (fetchedVideos) setVideos(fetchedVideos);
        if (fetchedReports) setMeetingReports(fetchedReports);
        if (fetchedPlaces) setMeetingPlaces(fetchedPlaces);
        if (fetchedPersonnel) setPersonnel(fetchedPersonnel);
        if (fetchedResources) setLearningResources(fetchedResources);
        if (fetchedClassrooms) setOnlineClassrooms(fetchedClassrooms);
        
        if (fetchedSettings) {
            if (fetchedSettings.schoolName) setSchoolName(fetchedSettings.schoolName);
            if (fetchedSettings.logoUrl) setLogoUrl(fetchedSettings.logoUrl);
            if (fetchedSettings.currentSemester) setCurrentSemester(fetchedSettings.currentSemester);
            if (fetchedSettings.semesterList) setSemesterList(fetchedSettings.semesterList);
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // Set default active menu based on role
    if (loggedInUser.role === Role.STUDENT) setActiveMenuId('s_dashboard');
    else if (loggedInUser.role === Role.TEACHER) setActiveMenuId('t_students');
    else setActiveMenuId('reg_info');
  };

  const handleLogout = () => {
    setUser(null);
    setSidebarOpen(false);
    setMobileTab('HOME'); // Reset mobile tab
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setInstallPrompt(null);
        setShowInstallPrompt(false);
      });
    }
  };

  // --- Data Handlers ---

  const handleSaveSettings = async (name: string, logo: string | null, semester: string) => {
      setSchoolName(name);
      setLogoUrl(logo);
      setCurrentSemester(semester);
      await api.post('/settings', { key: 'schoolName', value: name });
      await api.post('/settings', { key: 'logoUrl', value: logo });
      await api.post('/settings', { key: 'currentSemester', value: semester });
  };

  const handleAddSemester = async (newSem: string) => {
      const updatedList = [newSem, ...semesterList];
      setSemesterList(updatedList);
      await api.post('/settings', { key: 'semesterList', value: updatedList });
  };

  const handleUpdateStudent = async (id: string, data: Partial<Student>) => {
      const student = students.find(s => s.id === id);
      if (student) {
          const updated = { ...student, ...data };
          setStudents(prev => prev.map(s => s.id === id ? updated : s));
          await api.post('/students', updated);
      }
  };

  const handleAddStudent = async (data: any) => {
      const newStudent: Student = {
          ...data,
          enrolledCourses: [],
          activities: [],
          advisorHistory: []
      };
      setStudents(prev => [...prev, newStudent]);
      await api.post('/students', newStudent);
  };

  const handleDeleteStudent = async (id: string) => {
      setStudents(prev => prev.filter(s => s.id !== id));
      await api.delete(`/students/${id}`);
  };

  const handleAddUser = async (data: any) => {
      const userData = { 
          ...data, 
          password: data.password || data.id || '1234'
      };
      setUsers(prev => [...prev, userData]);
      await api.post('/users', userData);
  };

  const handleUpdateUser = async (id: string, data: any) => {
      const existingUser = users.find(u => u.id === id);
      const safeData = data as Record<string, any>;
      
      const payload = { 
          ...safeData, 
          id,
          password: safeData.password || existingUser?.password || id 
      };
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...safeData } : u));
      await api.post('/users', payload);
  };

  const handleDeleteUser = async (id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
      await api.delete(`/users/${id}`);
  };

  const handleImportData = async (type: ImportType, data: any[], shouldRedirect: boolean = false) => {
      setLoading(true);
      try {
          if (type === 'STUDENT') {
              // Batch insert for students
              await api.post('/students/batch', data);
              
              // Optimistically update local state
              const newStudents = [...students];
              data.forEach((s: Student) => {
                  const idx = newStudents.findIndex(ex => ex.id === s.id);
                  if (idx >= 0) newStudents[idx] = s;
                  else newStudents.push(s);
              });
              setStudents(newStudents);
          } 
          else if (type === 'GRADE' || type === 'ACTIVITY' || type === 'ADVISOR') {
              // OPTIMIZED: Create a Map for O(1) lookup
              const studentMap = new Map<string, Student>();
              students.forEach(s => studentMap.set(s.id, s));

              const updatedStudentsMap = new Map<string, Student>();
              
              const subjectMap = new Map<string, Subject>();
              subjects.forEach(s => subjectMap.set(s.id, s));

              // Helper to get mutable student object
              const getMutableStudent = (id: string) => {
                  if (updatedStudentsMap.has(id)) return updatedStudentsMap.get(id)!;
                  const found = studentMap.get(id);
                  if (found) {
                      const clone = { 
                          ...found,
                          enrolledCourses: [...(found.enrolledCourses || [])],
                          activities: [...(found.activities || [])],
                          advisorHistory: [...(found.advisorHistory || [])]
                      }; 
                      updatedStudentsMap.set(id, clone);
                      return clone;
                  }
                  return null;
              };

              // Single pass loop (O(M))
              for (const item of data) {
                  const student = getMutableStudent(item.studentId);
                  if (student) {
                      if (type === 'GRADE') {
                          // Update Enrollments
                          const existingCourseIndex = (student.enrolledCourses || []).findIndex(
                              c => c.subjectId === item.enrolledCourse.subjectId && c.semester === item.enrolledCourse.semester
                          );
                          let newCourses = [...(student.enrolledCourses || [])];
                          if (existingCourseIndex >= 0) {
                              newCourses[existingCourseIndex] = item.enrolledCourse;
                          } else {
                              newCourses.push(item.enrolledCourse);
                          }
                          student.enrolledCourses = newCourses;

                          let totalPoints = 0;
                          let totalCredits = 0;
                          
                          student.enrolledCourses.forEach(c => {
                              if (typeof c.grade === 'number' && c.grade > 0) {
                                  const sub = subjectMap.get(c.subjectId);
                                  const credit = sub ? sub.credit : 0;
                                  
                                  totalPoints += c.grade * credit;
                                  totalCredits += credit;
                              }
                          });
                          
                          student.gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.00;
                      } 
                      else if (type === 'ACTIVITY') {
                          // Update Activities
                          student.activities = [...(student.activities || []), item.activity];
                      }
                      else if (type === 'ADVISOR') {
                          // Update Advisor
                          const newHistory = [...(student.advisorHistory || []), {
                              semester: item.semester,
                              teacherId: item.teacherId
                          }];
                          let newMainTeacherId = student.teacherId;
                          if (item.semester === currentSemester) {
                              newMainTeacherId = item.teacherId;
                          }
                          student.teacherId = newMainTeacherId;
                          student.advisorHistory = newHistory;
                          
                          if (item.teacherName) {
                              student.teacherName = item.teacherName;
                          }
                      }
                  }
              }

              // Send BATCH Update to Server
              const studentsToUpdate = Array.from(updatedStudentsMap.values());
              if (studentsToUpdate.length > 0) {
                  await api.post('/students/batch', studentsToUpdate);
                  
                  // Update Local State Efficiently
                  setStudents(prev => prev.map(s => 
                      updatedStudentsMap.has(s.id) ? updatedStudentsMap.get(s.id)! : s
                  ));
              }
          }

          if (shouldRedirect) {
              if (type === 'STUDENT') setActiveMenuId('reg_students');
              else if (type === 'GRADE') setActiveMenuId('reg_grades');
              else if (type === 'ACTIVITY') setActiveMenuId('reg_kpch');
              else if (type === 'ADVISOR') setActiveMenuId('reg_students');
          }
      } catch (error) {
          console.error("Import error", error);
          alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล: " + (error as Error).message);
      } finally {
          setLoading(false);
      }
  };

  const handleUpdateEnrollment = async (studentId: string, courses: EnrolledCourse[]) => {
      const student = students.find(s => s.id === studentId);
      if (student) {
          const updated = { ...student, enrolledCourses: courses };
          setStudents(prev => prev.map(s => s.id === studentId ? updated : s));
          await api.post('/students', updated);
      }
  };

  // --- Helper for Colorful 3D Buttons ---
  const getColorStyles = (color: string = 'blue') => {
    const colors: Record<string, { bg: string, shadow: string, border: string, icon: string, shadowHex: string }> = {
      blue: { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', shadow: 'shadow-blue-800', border: 'border-blue-700', icon: 'text-blue-600', shadowHex: '#1e3a8a' },
      indigo: { bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600', shadow: 'shadow-indigo-800', border: 'border-indigo-700', icon: 'text-indigo-600', shadowHex: '#3730a3' },
      violet: { bg: 'bg-gradient-to-br from-violet-400 to-violet-600', shadow: 'shadow-violet-800', border: 'border-violet-700', icon: 'text-violet-600', shadowHex: '#5b21b6' },
      purple: { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', shadow: 'shadow-purple-800', border: 'border-purple-700', icon: 'text-purple-600', shadowHex: '#6b21a8' },
      fuchsia: { bg: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-600', shadow: 'shadow-fuchsia-800', border: 'border-fuchsia-700', icon: 'text-fuchsia-600', shadowHex: '#86198f' },
      pink: { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', shadow: 'shadow-pink-800', border: 'border-pink-700', icon: 'text-pink-600', shadowHex: '#9d174d' },
      rose: { bg: 'bg-gradient-to-br from-rose-400 to-rose-600', shadow: 'shadow-rose-800', border: 'border-rose-700', icon: 'text-rose-600', shadowHex: '#9f1239' },
      red: { bg: 'bg-gradient-to-br from-red-400 to-red-600', shadow: 'shadow-red-800', border: 'border-red-700', icon: 'text-red-600', shadowHex: '#991b1b' },
      orange: { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', shadow: 'shadow-orange-800', border: 'border-orange-700', icon: 'text-orange-600', shadowHex: '#9a3412' },
      amber: { bg: 'bg-gradient-to-br from-amber-400 to-amber-600', shadow: 'shadow-amber-800', border: 'border-amber-700', icon: 'text-amber-600', shadowHex: '#92400e' },
      yellow: { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', shadow: 'shadow-yellow-800', border: 'border-yellow-700', icon: 'text-yellow-600', shadowHex: '#854d0e' },
      lime: { bg: 'bg-gradient-to-br from-lime-400 to-lime-600', shadow: 'shadow-lime-800', border: 'border-lime-700', icon: 'text-lime-600', shadowHex: '#3f6212' },
      green: { bg: 'bg-gradient-to-br from-green-400 to-green-600', shadow: 'shadow-green-800', border: 'border-green-700', icon: 'text-green-600', shadowHex: '#166534' },
      emerald: { bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-800', border: 'border-emerald-700', icon: 'text-emerald-600', shadowHex: '#065f46' },
      teal: { bg: 'bg-gradient-to-br from-teal-400 to-teal-600', shadow: 'shadow-teal-800', border: 'border-teal-700', icon: 'text-teal-600', shadowHex: '#115e59' },
      cyan: { bg: 'bg-gradient-to-br from-cyan-400 to-cyan-600', shadow: 'shadow-cyan-800', border: 'border-cyan-700', icon: 'text-cyan-600', shadowHex: '#155e75' },
      sky: { bg: 'bg-gradient-to-br from-sky-400 to-sky-600', shadow: 'shadow-sky-800', border: 'border-sky-700', icon: 'text-sky-600', shadowHex: '#075985' },
    };
    return colors[color] || colors['blue'];
  };

  // --- View Rendering ---

  const activeMenuItem = useMemo(() => {
      return MENU_STRUCTURE.flatMap(s => s.items).find(i => i.id === activeMenuId);
  }, [activeMenuId]);

  const filteredStudents = useMemo(() => {
    if (!user) return [];
    // Admins and Registrars see everyone
    if (user.role === Role.ADMIN || user.role === Role.ADMIN_VIP || user.role === Role.REGISTRAR) {
      return students;
    }
    // Teachers see only their assigned students
    if (user.role === Role.TEACHER) {
      return students.filter(s => s.teacherId === user.id);
    }
    // Students see only themselves
    if (user.role === Role.STUDENT) {
      return students.filter(s => s.id === user.id);
    }
    return [];
  }, [user, students]);

  const renderContent = () => {
      if (!activeMenuItem) return <div className="text-slate-400">Welcome</div>;

      const viewType = activeMenuItem.type;
      
      switch (viewType) {
          case ViewType.DASHBOARD:
              return <Dashboard user={user!} students={students} subjects={subjects} criteria={gradCriteria} currentSemester={currentSemester} />;
          
          case ViewType.TABLE_LIST:
              if (activeMenuId === 'reg_students' || activeMenuId === 't_students') {
                  const teacherFilter = users.filter(u => u.role !== Role.STUDENT);
                  const displayStudents = (activeMenuId === 't_students' && user?.role === Role.TEACHER) ? filteredStudents : students;

                  return <DataTable 
                      data={displayStudents} 
                      title={activeMenuItem.label} 
                      variant="STUDENT"
                      onAdd={handleAddStudent}
                      onUpdate={(id, d) => handleUpdateStudent(id, d)}
                      onDelete={handleDeleteStudent}
                      userRole={user!.role}
                      teachers={teacherFilter}
                  />;
              }
              if (activeMenuId === 'gen_personnel') {
                  return <DataTable data={personnel} title={activeMenuItem.label} variant="STUDENT" readOnly />;
              }
              if (activeMenuId === 'reg_teachers') {
                  return <DataTable 
                      data={users} 
                      title="จัดการผู้ใช้งาน / ครู" 
                      variant="TEACHER"
                      onAdd={handleAddUser}
                      onUpdate={handleUpdateUser}
                      onDelete={handleDeleteUser}
                      userRole={user!.role}
                  />;
              }
              if (activeMenuId === 'reg_grades' || activeMenuId === 't_grades') {
                  if (viewingStudentId) {
                      const targetStudent = students.find(s => s.id === viewingStudentId);
                      if (targetStudent) {
                          return <GradeReport 
                              student={targetStudent}
                              subjects={subjects}
                              currentSemester={currentSemester}
                              onBack={() => setViewingStudentId(null)}
                          />;
                      }
                  }
                  
                  const displayStudents = (user?.role === Role.TEACHER) ? filteredStudents : students;
                  return <DataTable 
                      data={displayStudents}
                      title="ผลการเรียนของนักศึกษา"
                      variant="GRADE_SUMMARY"
                      onViewDetails={(s) => setViewingStudentId(s.id)}
                      userRole={user!.role}
                  />;
              }
              if (activeMenuId === 's_enrolled_courses') {
                  const myStudent = students.find(s => s.id === user!.id);
                  const myCourses = (myStudent?.enrolledCourses || [])
                      .filter(c => c.semester === currentSemester)
                      .map(c => {
                          const sub = subjects.find(s => s.id === c.subjectId);
                          return { ...c, subjectCode: sub?.code, subjectName: sub?.name, credit: sub?.credit, uniqueId: c.subjectId };
                      });
                  return <DataTable 
                      data={myCourses} 
                      title={`วิชาที่ลงทะเบียน (${currentSemester})`}
                      variant="CURRENT_ENROLLMENT"
                      readOnly
                  />;
              }
              return <div className="p-4 text-slate-400">Table View: {activeMenuItem.label}</div>;

          case ViewType.FORM:
              if (activeMenuId === 'reg_basic' || activeMenuId === 't_basic') {
                  return <SettingsForm 
                      initialSchoolName={schoolName} 
                      initialLogoUrl={logoUrl} 
                      semesterList={semesterList}
                      currentSemester={currentSemester}
                      onSave={handleSaveSettings}
                      readOnly={user!.role === Role.TEACHER} 
                  />;
              }
              if (activeMenuId === 'reg_import') {
                  return <ImportITW51 
                      onImport={handleImportData} 
                      onRequestRedirect={(type) => {
                          if (type === 'STUDENT') setActiveMenuId('reg_students');
                          else if (type === 'GRADE') setActiveMenuId('reg_grades');
                          else if (type === 'ACTIVITY') setActiveMenuId('reg_kpch');
                      }}
                      currentSemester={currentSemester}
                      teachers={users.filter(u => u.role !== Role.STUDENT)}
                      subjects={subjects}
                  />;
              }
              if (activeMenuId === 't_record_after') {
                  return <PostTeachingRecord user={user!} meetingReports={meetingReports} />;
              }
              if (activeMenuId === 't_screening' || activeMenuId === 't_moral') {
                  return <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">ส่วนนี้อยู่ระหว่างการพัฒนา (Form: {activeMenuItem.label})</div>;
              }
              return <div className="p-4 text-slate-400">Form View: {activeMenuItem.label}</div>;

          case ViewType.CURRICULUM:
              return <CurriculumManager 
                  subjects={subjects} 
                  setSubjects={setSubjects} 
                  criteria={gradCriteria} 
                  setCriteria={setGradCriteria}
                  userRole={user!.role}
                  onAdd={async (s) => { setSubjects(prev => [...prev, s]); await api.post('/subjects', s); }}
                  onUpdate={async (id, s) => { 
                      setSubjects(prev => prev.map(sub => sub.id === id ? { ...sub, ...s } : sub));
                      const updated = { ...subjects.find(sub => sub.id === id), ...s };
                      await api.post('/subjects', updated);
                  }}
                  onDelete={async (id) => {
                      setSubjects(prev => prev.filter(s => s.id !== id));
                      await api.delete(`/subjects/${id}`);
                  }}
              />;

          case ViewType.KPCH:
              return <KpchTracker 
                  students={filteredStudents} 
                  userRole={user!.role} 
                  currentSemester={currentSemester} 
                  onUpdateStudent={handleUpdateStudent}
                  teachers={users.filter(u => u.role !== Role.STUDENT)}
              />;

          case ViewType.TRANSCRIPT:
              const studentForTranscript = filteredStudents[0];
              if (!studentForTranscript) return <div className="text-slate-400">ไม่พบข้อมูลนักศึกษา</div>;
              
              return <GradeReport 
                  student={studentForTranscript} 
                  subjects={subjects} 
                  currentSemester={currentSemester}
              />;

          case ViewType.MEETING_REPORT:
              return <MeetingReports 
                  user={user!} 
                  reports={meetingReports}
                  onSave={async (r) => {
                      setMeetingReports(prev => {
                          const idx = prev.findIndex(item => item.id === r.id);
                          if (idx >= 0) { const updated = [...prev]; updated[idx] = r; return updated; }
                          return [r, ...prev];
                      });
                      await api.post('/reports', r);
                  }}
                  onDelete={async (id) => {
                      setMeetingReports(prev => prev.filter(r => r.id !== id));
                      await api.delete(`/reports/${id}`);
                  }}
              />;

          case ViewType.MEETING_PLACE:
              return <MeetingPlaceManager 
                  places={meetingPlaces}
                  userRole={user!.role}
                  onSave={async (p) => {
                      setMeetingPlaces(prev => {
                          const idx = prev.findIndex(item => item.id === p.id);
                          if (idx >= 0) { const updated = [...prev]; updated[idx] = p; return updated; }
                          return [...prev, p];
                      });
                      await api.post('/meeting-places', p);
                  }}
                  onDelete={async (id) => {
                      setMeetingPlaces(prev => prev.filter(p => p.id !== id));
                      await api.delete(`/meeting-places/${id}`);
                  }}
              />;

          case ViewType.LEARNING_RESOURCE:
              return <LearningResourceManager 
                  resources={learningResources}
                  userRole={user!.role}
                  onSave={async (r) => {
                      setLearningResources(prev => {
                          const idx = prev.findIndex(item => item.id === r.id);
                          if (idx >= 0) { const updated = [...prev]; updated[idx] = r; return updated; }
                          return [...prev, r];
                      });
                      await api.post('/resources', r);
                  }}
                  onDelete={async (id) => {
                      setLearningResources(prev => prev.filter(r => r.id !== id));
                      await api.delete(`/resources/${id}`);
                  }}
              />;

          case ViewType.ONLINE_CLASSROOM:
              return <OnlineClassroomManager 
                  classrooms={onlineClassrooms}
                  subjects={subjects}
                  userRole={user!.role}
                  currentUser={user!}
                  currentSemester={currentSemester}
                  students={students}
                  onAdd={async (c) => {
                      setOnlineClassrooms(prev => [...prev, c]);
                      await api.post('/classrooms', c);
                  }}
                  onDelete={async (id) => {
                      setOnlineClassrooms(prev => prev.filter(c => c.id !== id));
                      await api.delete(`/classrooms/${id}`);
                  }}
              />;

          case ViewType.ENROLLMENT:
              return <EnrollmentManager 
                  students={filteredStudents}
                  subjects={subjects}
                  currentSemester={currentSemester}
                  semesterList={semesterList}
                  userRole={user!.role}
                  onSave={handleUpdateEnrollment}
              />;

          case ViewType.EXAM_SCHEDULE:
              return <ExamScheduleManager 
                  userRole={user!.role}
                  subjects={subjects}
                  students={students}
                  currentUser={user!}
                  currentSemester={currentSemester}
              />;

          case ViewType.CONTENT:
              if (activeMenuId === 'gen_website') {
                  const mockContact = { website: 'https://example.com', facebook: 'https://fb.com', lineId: '@nfe' };
                  return <ContactChannels 
                      contactInfo={mockContact} 
                      userRole={user!.role} 
                      onSave={(info) => console.log('Save contact', info)} 
                  />;
              }
              if (activeMenuId === 't_textbooks' || activeMenuId === 's_textbooks') {
                  return <TextbookManager userRole={user!.role} />;
              }
              if (activeMenuId === 't_media' || activeMenuId === 's_media') {
                  return <VideoManager 
                      videos={videos} 
                      userRole={user!.role} 
                      currentUser={user!}
                      onAdd={async (v) => { setVideos(prev => [...prev, v]); await api.post('/videos', v); }}
                      onDelete={async (id) => { setVideos(prev => prev.filter(v => v.id !== id)); await api.delete(`/videos/${id}`); }}
                  />;
              }
              if (activeMenuId === 't_guidance') {
                  return <MidtermExamManager 
                      userRole={user!.role}
                      currentUser={user!}
                      subjects={subjects}
                      students={students}
                      currentSemester={currentSemester}
                  />;
              }
              if (activeMenuId === 'gen_relax') {
                  return <MeetingPlaceManager 
                      places={meetingPlaces} userRole={Role.STUDENT} onSave={()=>{}} onDelete={()=>{}} 
                  />;
              }
              return <div className="text-slate-400">Content View</div>;

          default:
              return <div className="text-slate-400">Unknown View</div>;
      }
  };

  // --- Helper for Icons ---
  const renderIcon = (iconName?: string) => {
      if (!iconName) return <Settings size={20} className="opacity-50" />;
      
      const Lucide = LucideIcons as any;
      const IconComponent = Lucide[iconName];
      
      if (IconComponent) {
          return <IconComponent size={24} strokeWidth={2} />;
      }
      return <Settings size={24} className="opacity-50" />;
  };

  // --- Helper for Menu Styling ---
  const getSidebarIconColor = (isActive: boolean) => {
      return isActive ? 'text-white' : 'text-slate-500';
  };

  // --- Auth Render ---
  if (!user) {
    return <Login 
        onLogin={handleLogin} 
        logoUrl={logoUrl} 
        schoolName={schoolName}
        users={users}
        students={students}
    />;
  }

  // --- Filtered Sections for User Role ---
  const filteredSections = MENU_STRUCTURE.map(section => ({
    ...section,
    items: section.items.filter(item => {
        if (item.roles && !item.roles.includes(user.role)) return false;
        if (!item.roles && !section.roles.includes(user.role)) return false;
        return true;
    })
  })).filter(section => section.items.length > 0);

  // --- Shared Modals ---
  const CommonModals = () => (
    <>
      <InstallPrompt 
        isOpen={showInstallPrompt} 
        onClose={() => setShowInstallPrompt(false)} 
        onInstall={handleInstallClick}
        isIOS={/iPad|iPhone|iPod/.test(navigator.userAgent)}
        deferredPrompt={installPrompt}
      />

      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        user={user}
        onChangePassword={async (newPass) => {
            const updated = { ...user, password: newPass };
            setUser(updated);
            await api.post('/users', updated);
            alert('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
        }}
      />

      <AddSemesterModal 
        isOpen={showSemesterModal}
        onClose={() => setShowSemesterModal(false)}
        onAdd={handleAddSemester}
        existingSemesters={semesterList}
      />
    </>
  );

  // ==============================
  // 📱 MOBILE LAYOUT (App-Like)
  // ==============================
  if (isMobile) {
      return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 font-prompt text-slate-800">
            <CommonModals />
            
            {/* 📱 Mobile Header */}
            <header className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                        {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : 'BB'}
                    </div>
                    <div>
                        <h1 className="font-bold text-blue-900 text-sm leading-tight">{schoolName}</h1>
                        <p className="text-[10px] text-slate-500">ระบบบริหารจัดการศึกษา</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bell size={20} className="text-slate-500" />
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>
            </header>

            {/* 📱 Mobile Content Body */}
            <main className="flex-1 overflow-y-auto pb-24 scroll-smooth bg-slate-50">
                {mobileTab === 'MENU' ? (
                    // MENU GRID (Launcher) - 3D Icons
                    <div className="p-4 space-y-6 animate-fade-in">
                        {filteredSections.map((section) => (
                            <div key={section.title} className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{section.title}</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {section.items.map((item) => {
                                        const color = getColorStyles(item.color || 'blue');
                                        const isActive = activeMenuId === item.id;
                                        return (
                                            <button 
                                                key={item.id}
                                                onClick={() => { setActiveMenuId(item.id); setMobileTab('HOME'); }}
                                                className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-150 active:translate-y-1 active:shadow-none h-28 w-full border-b-0 group
                                                    ${color.bg} ${isActive ? 'ring-2 ring-white ring-opacity-50' : ''}`}
                                                style={{ 
                                                    boxShadow: `0 6px 0 ${color.shadowHex}, 0 10px 10px -5px rgba(0,0,0,0.2)` 
                                                }}
                                            >
                                                <div className="p-3 rounded-full bg-white/20 text-white backdrop-blur-sm shadow-inner group-active:bg-white/30">
                                                    {renderIcon(item.icon)}
                                                </div>
                                                <span className="text-[10px] font-bold text-white text-center leading-tight drop-shadow-md px-1">
                                                    {item.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : mobileTab === 'PROFILE' ? (
                    // PROFILE TAB
                    <div className="p-4 space-y-4 animate-fade-in">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-2xl font-bold border border-slate-200 text-slate-500">
                                {user.name.charAt(0)}
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
                            <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1 border border-blue-100">{user.role}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <button 
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full p-4 flex items-center justify-between border-b border-slate-100 active:bg-slate-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                        <Settings size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">เปลี่ยนรหัสผ่าน</span>
                                </div>
                                <ChevronDown className="-rotate-90 text-slate-400" size={16} />
                            </button>
                            {user.role === Role.ADMIN && (
                                <button 
                                    onClick={() => setShowSemesterModal(true)}
                                    className="w-full p-4 flex items-center justify-between active:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                            <Calendar size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">เพิ่มภาคเรียน</span>
                                    </div>
                                    <ChevronDown className="-rotate-90 text-slate-400" size={16} />
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
                        >
                            <LogOut size={18} /> ออกจากระบบ
                        </button>
                    </div>
                ) : (
                    // HOME TAB (Active View)
                    <div className="p-0 animate-fade-in">
                        {/* Semester Selector for Mobile */}
                        <div className="bg-white px-4 py-2 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                            <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">{activeMenuItem?.label || 'หน้าหลัก'}</span>
                            <div className="relative">
                                <select 
                                    value={currentSemester}
                                    onChange={(e) => setCurrentSemester(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-1 pl-3 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                                >
                                    <option value="ALL">ทั้งหมด</option>
                                    {semesterList.map(sem => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-2 text-slate-500 pointer-events-none" />
                            </div>
                        </div>
                        
                        {renderContent()}
                    </div>
                )}
            </main>

            {/* 📱 Bottom Navigation Bar */}
            <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full pb-safe z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-[65px] px-2">
                    <button 
                        onClick={() => setMobileTab('HOME')} 
                        className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${mobileTab === 'HOME' ? 'text-blue-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Home size={24} strokeWidth={mobileTab === 'HOME' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">หน้าหลัก</span>
                    </button>
                    
                    {/* Menu Button (Center) */}
                    <button 
                        onClick={() => setMobileTab('MENU')}
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-full -mt-6 border-4 border-white shadow-lg transition-transform active:scale-95
                            ${mobileTab === 'MENU' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        <Grid size={24} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={() => setMobileTab('PROFILE')} 
                        className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${mobileTab === 'PROFILE' ? 'text-blue-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <UserIcon size={24} strokeWidth={mobileTab === 'PROFILE' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">บัญชี</span>
                    </button>
                </div>
            </nav>
        </div>
      );
  }

  // ==============================
  // 🖥️ DESKTOP LAYOUT
  // ==============================
  return (
    <div className="flex h-[100dvh] bg-slate-50 font-prompt text-slate-800">
      <CommonModals />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-800 flex items-center justify-center text-white shrink-0 overflow-hidden shadow-md">
                {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : <span className="font-bold text-lg">BB</span>}
            </div>
            <div>
              <h1 className="font-bold text-blue-900 leading-tight line-clamp-1">{schoolName}</h1>
              <p className="text-xs text-slate-500">ระบบบริหารจัดการ</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
            {filteredSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map(item => {
                    const color = getColorStyles(item.color || 'blue');
                    const isActive = activeMenuId === item.id;
                    return (
                        <button
                        key={item.id}
                        onClick={() => {
                            setActiveMenuId(item.id);
                            setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                            ${isActive 
                            ? 'bg-slate-50 text-slate-800 shadow-sm border border-slate-100' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isActive ? `${color.bg} text-white shadow-md` : 'text-slate-400 group-hover:text-slate-600 bg-slate-100'}`}>
                            {renderIcon(item.icon)}
                        </span>
                        {item.label}
                        </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors" onClick={() => setShowPasswordModal(true)}>
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-sm">
                <UserIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
            >
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-slate-50">
        
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 hidden sm:block tracking-tight">
              {activeMenuItem?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Semester Selector */}
            <div className="relative group">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-colors">
                    <Calendar size={16} className="text-slate-400 group-hover:text-blue-500" />
                    <span>{currentSemester === 'ALL' ? 'ทั้งหมด' : `ภาคเรียน ${currentSemester}`}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                    <div className="py-1">
                        <button 
                            onClick={() => setCurrentSemester('ALL')}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentSemester === 'ALL' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                        >
                            ทั้งหมด (ดูย้อนหลัง)
                        </button>
                        {semesterList.map(sem => (
                            <button 
                                key={sem}
                                onClick={() => setCurrentSemester(sem)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${currentSemester === sem ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                            >
                                ภาคเรียน {sem}
                            </button>
                        ))}
                        {user.role === Role.ADMIN && (
                            <button 
                                onClick={() => setShowSemesterModal(true)}
                                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 font-medium border-t border-slate-100"
                            >
                                + เพิ่มภาคเรียน
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth z-1 relative">
          {loading ? (
              <div className="flex items-center justify-center h-64 text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  กำลังโหลดข้อมูล...
              </div>
          ) : (
              renderContent()
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
