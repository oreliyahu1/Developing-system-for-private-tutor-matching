import { Course, Certificate, Location } from "./";

export class User {
  _id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  location: Location;

  type: UserType;
  answers_vector: { q_id: number, ans: number[] };
  weights_vector: { q_id: number, wght: number[] };

  //for tutor
  courses?: Course[];
  certificates?: Certificate[];
  costPerHour?: number;

  matchingGrade?: number;
  token?: string;
}

export enum UserType {
  Student = 'Student',
  Tutor = 'Tutor',
  Admin = 'Admin',
  None = 'None'
}

export const MIN_MATCHING_GRADE = 60;