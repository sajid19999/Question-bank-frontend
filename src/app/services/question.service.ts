import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

type SubsectionResponse = {
  [key: string]: { questionId: number; question: string }[];
};

type QuestionDetails = {
  questionId: number;
  subSection: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private baseUrl = 'http://localhost:8080/api/questions';

  constructor(private http: HttpClient) {}

  // Fetch subtopics for a given topic
  getSubTopicsByTopic(topic: string): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(`${this.baseUrl}/topic/${topic}`);
  }

  // Fetch subsections for a given subtopic
  getSubSectionsBySubTopic(subTopic: string): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(`${this.baseUrl}/subTopic/${subTopic}`);
  }

  getQuestionsBySubSection(subsection: string, questionType: string): Observable<{ [key: string]: number[] }> {
    // Trim the subsection to remove unnecessary spaces
    const trimmedSubsection = subsection.trim();
  
    // Log the trimmed subsection and question type for debugging
    console.log('Trimmed Subsection:', trimmedSubsection);
    console.log('Question Type:', questionType);
  
    // Encode the subsection to handle spaces and special characters
    const encodedSubsection = encodeURIComponent(trimmedSubsection);
  
    // Construct the URL with proper formatting
    const url = `${this.baseUrl}/subSection/${encodedSubsection}/${questionType}`;
  
    // Log the final URL for debugging
    console.log('Final URL:', url);
  
    return this.http.get<{ [key: string]: number[] }>(url);
  }

  // Fetch a specific question by its ID
  getQuestionById(questionId: number): Observable<QuestionDetails> {
    return this.http.get<QuestionDetails>(`${this.baseUrl}/${questionId}`);
  }

  // Submit an answer for a question
  submitAnswer(questionId: number, isCorrect: boolean, token: string): Observable<any> {
    const payload = { questionId, isCorrect };
    return this.http.post(`${this.baseUrl}/submit`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Fetch a question by its text
  getQuestionByText(questionText: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/questionByText`, {
      params: { question: questionText },
    });
  }
}