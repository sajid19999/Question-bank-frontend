import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:8080/api/questions';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Topic endpoints
  getSubTopicsByTopic(topic: string, token: string): Observable<{ [key: string]: string[] }> {
    const encodedTopic = encodeURIComponent(topic);
    return this.http.get<{ [key: string]: string[] }>(
      `${this.baseUrl}/topic/${encodedTopic}`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  // Subtopic endpoints
  getSubSectionsBySubTopic(subTopic: string, token: string): Observable<{ [key: string]: string[] }> {
    const encodedSubTopic = encodeURIComponent(subTopic);
    return this.http.get<{ [key: string]: string[] }>(
      `${this.baseUrl}/subTopic/${encodedSubTopic}`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  // Subsection endpoints
  getQuestionsBySubSection(subsection: string, questionType: string, token: string): Observable<{ [key: string]: number[] }> {
    const encodedSubsection = encodeURIComponent(subsection.trim());
    return this.http.get<{ [key: string]: number[] }>(
      `${this.baseUrl}/subSection/${encodedSubsection}/${questionType}`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  // Question endpoints
  getQuestionById(questionId: number, token: string): Observable<QuestionDetails> {
    return this.http.get<QuestionDetails>(
      `${this.baseUrl}/${questionId}`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  // Answer submission
  submitAnswer(payload: {questionId: number, selectedAnswer: string}, token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/submit`,
      payload,
      { headers: this.getAuthHeaders(token) }
    );
  }
}