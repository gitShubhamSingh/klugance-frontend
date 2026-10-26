
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
      dashboard: "/dashboard",
      navigation: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "My Students", href: "/teacher/students", icon: Users },
        { title: "Timetable", href: "/teacher/timetable", icon: CalendarDays },
        { title: "Attendance", href: "/teacher/attendance", icon: CalendarCheck },
        { title: "Homework", href: "/teacher/homework", icon: BookOpen },
        // { title: "Exams", href: "/teacher/exams", icon: FileText },
        { title: "Communication", href: "/teacher/communication", icon: Megaphone },
      ],
    },
    student: {
      label: "Student Portal",
      dashboard: "/dashboard",
      navigation: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Attendance", href: "/student/attendance", icon: CalendarCheck },
        { title: "Homework", href: "/student/homework", icon: BookOpen },
        // { title: "Exams & Results", href: "/student/exams", icon: FileText },
        { title: "Timetable", href: "/student/timetable", icon: CalendarDays },
        { title: "Communication", href: "/student/communication", icon: Megaphone },
      ],
    },
    parent: {
      label: "Parent Portal",
      dashboard: "/dashboard",
      navigation: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
        { title: "Homework", href: "/parent/homework", icon: BookOpen },
        // { title: "Fees", href: "/parent/fees", icon: WalletCards },
        // { title: "Transport", href: "/parent/transport", icon: Bus },
        { title: "Communication", href: "/parent/communication", icon: Megaphone },
      ],
    },
  } as const;
  