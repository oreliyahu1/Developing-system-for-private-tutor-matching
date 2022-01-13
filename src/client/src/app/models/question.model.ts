export class Question{
    _id: number;
    name: string;
    type: QuestionType;
    grade_rate: number;
}

export enum QuestionType {
    Student = 'Student',
    Tutor = 'Tutor',
    Both = 'Both'
}