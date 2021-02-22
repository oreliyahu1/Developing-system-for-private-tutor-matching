import { User } from './'

export class Feedback{
    _id: number;
    meeting: number;
    from_user: User;
    to_user: User;
    type: FeedbackType;
    good: boolean;

    from_user_feedback_answers_vector?: { q_id: number; ans: number[] };

    from_user_current_answers_vector?: { q_id: number; ans: number[] };
    from_user_current_weights_vector?: { q_id: number; wght: number[] };
    to_user_current_answers_vector?: { q_id: number; ans: number[] };
    to_user_current_weights_vector?: { q_id: number; wght: number[] };   
}

export enum FeedbackType {
    SST = "STT",
    TTS = "TTS"
}