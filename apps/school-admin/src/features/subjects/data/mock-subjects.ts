import type { Subject } from "../types";

export const mockClasses = [
  {
    id: "class-1",
    name: "Class 1",
  },
  {
    id: "class-2",
    name: "Class 2",
  },
  {
    id: "class-3",
    name: "Class 3",
  },{
    id: "class-4",
    name: "Class 4",
  },{
    id: "class-5",
    name: "Class 5",
  },{
    id: "class-6",
    name: "Class 6",
  },{
    id: "class-7",
    name: "Class 7",
  },{
    id: "class-8",
    name: "Class 8",
  },{
    id: "class-9",
    name: "Class 9",
  },{
    id: "class-10",
    name: "Class 10",
  },{
    id: "class-11",
    name: "Class 11",
  },{
    id: "class-12",
    name: "Class 12",
  },
];

export const mockSections = [
  {
    id: "section-1",
    classId: "class-1",
    name: "Section A",
  },
  {
    id: "section-2",
    classId: "class-1",
    name: "Section B",
  },
  {
    id: "section-3",
    classId: "class-2",
    name: "Section A",
  },
  {
    id: "section-4",
    classId: "class-2",
    name: "Section B",
  },
  {
    id: "section-5",
    classId: "class-3",
    name: "Section A",
  },
];

export const mockSubjects: Subject[] = [
  {
    id: "subject-1",
    name: "Mathematics",
    code: "MATH",
    description: "Mathematics and numerical studies",
    classId: "class-1",
    sectionId: "section-1",
  },
  {
    id: "subject-2",
    name: "Physics",
    code: "PHY",
    description: "Fundamentals of physics",
    classId: "class-1",
    sectionId: "section-1",
  },
  {
    id: "subject-3",
    name: "Chemistry",
    code: "CHEM",
    description: "Chemical science and concepts",
    classId: "class-1",
    sectionId: "section-1",
  },
  {
    id: "subject-4",
    name: "English",
    code: "ENG",
    description: "English language and communication",
    classId: "class-1",
    sectionId: "section-1",
  },
  {
    id: "subject-5",
    name: "Computer Science",
    code: "CS",
    description: "Computer science fundamentals",
    classId: "class-1",
    sectionId: "section-1",
  },
  {
    id: "subject-6",
    name: "Social Science",
    code: "SST",
    description: "Social and cultural studies",
    classId: "class-1",
    sectionId: "section-1",
  },
];