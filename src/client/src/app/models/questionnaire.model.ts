import { Question } from './'

export class Questionnaire{
    _id: number;
    type: QuestionnaireType;
    questions: Question[];
    weights: number[];
}

export enum QuestionnaireType {
    Student = 'Student',
    Tutor = 'Tutor'
}