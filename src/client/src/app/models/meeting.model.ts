import { Course, User, Location } from "./";

export class Meeting {
  _id: number;
  course: Course;
  student: User;
  tutor: User;
  status: MeetingStatus;
  time: Date;
  locatin: Location;

  matchingGrade?: number;
}

export enum MeetingStatus {
  Request = 'Request',
  Approved = 'Approved',
  Rejected = 'Rejected',
  WaitingForFeedback10 = 'WaitingForFeedback10',
  WaitingForFeedback01 = 'WaitingForFeedback01',
  Completed = 'Completed'
};