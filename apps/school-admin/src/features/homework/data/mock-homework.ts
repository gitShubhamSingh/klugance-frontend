import type { Homework } from "../types";

export const mockHomework: Homework[] = [
  {
    id: "hw-001",
    title: "Algebraic Expressions",
    description:
      "Complete questions 1–15 from the algebraic expressions exercise and show all working steps.",

    subject: "Mathematics",

    class_name: "Class 8",
    section_name: "Section A",

    teacher_name: "Rahul Sharma",

    assigned_date: "2026-08-21",
    due_date: "2026-08-25",

    total_students: 42,
    submitted_students: 31,

    status: "active",
  },

  {
    id: "hw-002",
    title: "The Human Digestive System",
    description:
      "Prepare a labelled diagram of the human digestive system and write a short explanation of each major organ.",

    subject: "Science",

    class_name: "Class 8",
    section_name: "Section A",

    teacher_name: "Priya Mehta",

    assigned_date: "2026-08-22",
    due_date: "2026-08-24",

    total_students: 42,
    submitted_students: 36,

    status: "due_soon",
  },

  {
    id: "hw-003",
    title: "Essay: My Favorite Place",
    description:
      "Write a 300-word essay describing your favorite place and explain why it is meaningful to you.",

    subject: "English",

    class_name: "Class 7",
    section_name: "Section B",

    teacher_name: "Anita Verma",

    assigned_date: "2026-08-18",
    due_date: "2026-08-22",

    total_students: 38,
    submitted_students: 34,

    status: "overdue",
  },

  {
    id: "hw-004",
    title: "Indian Freedom Movement",
    description:
      "Prepare a timeline covering the major events of India's freedom movement from 1857 to 1947.",

    subject: "Social Science",

    class_name: "Class 9",
    section_name: "Section A",

    teacher_name: "Amit Kumar",

    assigned_date: "2026-08-15",
    due_date: "2026-08-20",

    total_students: 40,
    submitted_students: 40,

    status: "completed",
  },

  {
    id: "hw-005",
    title: "Fractions and Decimals",
    description:
      "Solve the assigned fraction and decimal problems from the worksheet.",

    subject: "Mathematics",

    class_name: "Class 6",
    section_name: "Section C",

    teacher_name: "Neha Singh",

    assigned_date: "2026-08-23",
    due_date: "2026-08-27",

    total_students: 35,
    submitted_students: 12,

    status: "active",
  },
];