// models/question.model.ts
export interface Question {
    questionId: number;
    topic: string;
    subTopic: string;
    subSection: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    membershipType: string; // Add this field
  }