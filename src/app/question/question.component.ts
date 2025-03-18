import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../services/question.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
type Chapter = {
  title: string; // Maps to subTopic from the backend
  subtopics: string[]; // Maps to subSection from the backend
};

type QuestionDetails = {
  questionId: number;
  subSection: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatIcon,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  disableScreenshots: boolean = true; // Set to true to enable the overlay
  allTopics: string[] = ['Accounting & Finance', 'Investment & Banking', 'Sales & Trading']; // Hardcoded topics from NavbarComponent
  selectedTopic: string = '';
  chapters: Chapter[] = []; // Chapters for the selected topic
  selectedSubsection: string = '';
  questions: number[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: QuestionDetails | null = null;
  selectedOption: string | null = null; // Track the selected option
  isSubmitted: boolean = false; // Track if the question is submitted
  isLoading: boolean = false; // Track loading state
  isCorrectAnswer: boolean | null = null; // Track if the selected answer is correct
  showRightSidebar: boolean = false; // Control the visibility of the right sidebar
  showSetupSection: boolean = false; // Control visibility of setup section
  selectedQuestionType: string = 'knowledge'; // Default question type
  showTimer: string = 'yes'; 
  totalQuestions: number = 0; // Total number of questions
  correctAnswers: number = 0; // Number of correct answers
  showResultPopup: boolean = false; // Control visibility of the result popup
  isQuizStarted: boolean = false;
  scoreTooltip: string = ''; // Tooltip text for the button

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    console.log('Initializing QuestionComponent...');

    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        alert('Screenshots and printing are disabled.');
      }
    });

    document.addEventListener('copy', (e) => e.preventDefault());
    document.addEventListener('cut', (e) => e.preventDefault());
    document.addEventListener('paste', (e) => e.preventDefault());

    // Get the selected topic from the route parameters
    this.route.paramMap.subscribe((params) => {
      const topic = params.get('topic');
      if (topic) {
        console.log('Selected Topic from route:', topic);
        this.selectedTopic = topic;
        this.loadChaptersForTopic(topic);
      } else {
        console.warn('No topic found in route parameters.');
      }
    });
  }

  // Method to convert index to option prefix (e.g., 0 -> 'a)', 1 -> 'b)', etc.)
  getOptionPrefix(index: number): string {
    return String.fromCharCode(97 + index) + ')'; // 97 is ASCII for 'a'
  }

  onTopicSelect(topic: string): void {
    this.selectedTopic = topic;
    this.showRightSidebar = true; // Show the right sidebar
    this.loadChaptersForTopic(topic);
  }

  loadChaptersForTopic(topic: string): void {
    console.log('Loading chapters for topic:', topic);

    this.questionService.getSubTopicsByTopic(topic).subscribe({
      next: (subTopicMap) => {
        console.log('SubTopicMap received:', subTopicMap);

        const subTopics = subTopicMap[topic] || [];
        console.log('Subtopics for topic:', subTopics);

        this.chapters = subTopics.map((subTopic: string) => ({
          title: subTopic,
          subtopics: [],
        }));
        console.log('Chapters initialized:', this.chapters);

        this.chapters.forEach((chapter) => {
          console.log('Fetching subsections for chapter:', chapter.title);
          this.questionService
            .getSubSectionsBySubTopic(chapter.title)
            .subscribe({
              next: (subSectionMap) => {
                console.log('SubSectionMap received for chapter:', chapter.title, subSectionMap);
                chapter.subtopics = subSectionMap[chapter.title] || [];
                console.log('Subtopics loaded for chapter:', chapter.title, chapter.subtopics);
              },
              error: (err) => {
                console.error('Error fetching subsections for chapter:', chapter.title, err);
              },
            });
        });
      },
      error: (err) => {
        console.error('Error fetching subtopics for topic:', topic, err);
      },
    });
  }

  onSubtopicSelect(subtopic: string): void {
    console.log('Subtopic selected:', subtopic);
    this.selectedSubsection = subtopic;
    this.showRightSidebar = false; // Hide the right sidebar
    this.resetQuestionState();
    this.showSetupSection = true; // Show the setup section
  }

  resetQuestionState(): void {
    this.currentQuestionIndex = 0;
    this.currentQuestion = null;
    this.selectedOption = null;
    this.isSubmitted = false;
    this.isCorrectAnswer = null;
  }

  loadQuestionsForSubsection(subsection: string): void {
    console.log('Loading questions for subsection:', subsection);
    this.isLoading = true;
  
    // Trim the subsection before passing it to the service
    const trimmedSubsection = subsection.trim();
  
    this.questionService.getQuestionsBySubSection(trimmedSubsection, this.selectedQuestionType).subscribe({
      next: (questionMap) => {
        console.log('QuestionMap received:', questionMap);
        this.questions = questionMap[trimmedSubsection] || [];
        this.totalQuestions = this.questions.length; // Set total questions
        console.log('Questions loaded:', this.questions);
        if (this.questions.length > 0) {
          this.loadQuestion(this.questions[0]);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching questions for subsection:', trimmedSubsection, err);
        this.isLoading = false;
      },
    });
  }

  loadQuestion(questionId: number): void {
    console.log('Loading question with ID:', questionId);
    this.isLoading = true;
    this.questionService.getQuestionById(questionId).subscribe({
      next: (question) => {
        console.log('Question received:', question);
        this.currentQuestion = question;
        this.isLoading = false;
        this.isSubmitted = false;
        this.selectedOption = null;
      },
      error: (err) => {
        console.error('Error fetching question:', err);
        this.isLoading = false;
      },
    });
  }

  onOptionSelect(option: string): void {
    this.selectedOption = option;
  }
  public stripPrefix(answer: string): string {
    return answer.replace(/^[a-zA-Z]\)\s*/, '');
  }

  onSubmit(): void {
    if (this.selectedOption && this.currentQuestion) {
      this.isSubmitted = true;

      // Strip the prefix from the correct answer
      const correctAnswerWithoutPrefix = this.stripPrefix(this.currentQuestion.correctAnswer);

      // Compare the selected option with the correct answer (without prefix)
      this.isCorrectAnswer = this.selectedOption === correctAnswerWithoutPrefix;

      // Update the score if the answer is correct
      if (this.isCorrectAnswer) {
        this.correctAnswers++;
      }

      // Update the tooltip text
      this.scoreTooltip = 'Your score is ready!';

      console.log('Selected Option:', this.selectedOption);
      console.log('Correct Answer (without prefix):', correctAnswerWithoutPrefix);
      console.log('Is Correct:', this.isCorrectAnswer);

      // Move to the next question
      this.onNextQuestion();
    }
  }
  onNextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadQuestion(this.questions[this.currentQuestionIndex]);
    }
  }

  showResults(): void {
    console.log('Showing results popup...');
    this.showResultPopup = true;
    console.log('showResultPopup:', this.showResultPopup);
  }

  resetQuiz(): void {
    this.correctAnswers = 0;
    this.currentQuestionIndex = 0;
    this.showResultPopup = false;
    this.isQuizStarted = false; // Reset quiz state
    this.resetQuestionState();
  }

  closeResultPopup(): void {
    this.showResultPopup = false;
    this.backToSubsection();
  }

  onPreviousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadQuestion(this.questions[this.currentQuestionIndex]);
    }
  }
  closeRightSidebar(): void {
    this.showRightSidebar = false;
  }
 

  startQuestions(): void {
    this.showSetupSection = false; // Hide the setup section
    this.isQuizStarted = true; // Quiz has started
    this.loadQuestionsForSubsection(this.selectedSubsection); // Load questions
  }
// Method to go back to subsection selection
backToSubsection(): void {
  this.resetQuestionState(); // Reset question state
  this.showSetupSection = true; // Show the setup section
  this.showRightSidebar = true; // Show the right sidebar
}
}