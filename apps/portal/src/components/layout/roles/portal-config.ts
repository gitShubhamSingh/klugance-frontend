
import {
    BookOpen,
    Bus,
    CalendarCheck,
    CalendarDays,
    FileText,
    LayoutDashboard,
    Megaphone,
    Users,
    WalletCards,
  } from "lucide-react";
  
  export type PortalRole = "teacher" | "student" | "parent";
  
  export const portalConfig = {
    teacher: {
      label: "Teacher Portal",
      dashboard: "/teacher/dashboard",
      navigation: [
        { title: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
        { title: "My Students", href: "/teacher/students", icon: Users },
        { title: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
        { title: "Homework", href: "/teacher/homework", icon: BookOpen },
        { title: "Exams", href: "/teacher/exams", icon: FileText },
        { title: "Timetable", href: "/teacher/timetable", icon: CalendarDays },
        { title: "Communication", href: "/teacher/communication", icon: Megaphone },
      ],
    },
    student: {
      label: "Student Portal",
      dashboard: "/student/dashboard",
      navigation: [
        { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
        { title: "Attendance", href: "/student/attendance", icon: CalendarCheck },
        { title: "Homework", href: "/student/homework", icon: BookOpen },
        { title: "Exams & Results", href: "/student/exams", icon: FileText },
        { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
      ],
    },
    parent: {
      label: "Parent Portal",
      dashboard: "/parent/dashboard",
      navigation: [
        { title: "Dashboard", href: "/parent/dashboard", icon: LayoutDashboard },
        { title: "Fees", href: "/parent/fees", icon: WalletCards },
        { title: "Transport", href: "/parent/transport", icon: Bus },
        { title: "Communication", href: "/parent/communication", icon: Megaphone },
      ],
    },
  } as const;
  