import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

type Chapter = {
  title: string;       // Maps to subTopic from the backend
  subtopics: string[]; // Maps to subSection from the backend
  completed?: boolean;  // Optional flag for completion status
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
    MatSliderModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatIcon,
    MatTooltipModule,
    RouterLink,
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
  completedSubtopics: Set<string> = new Set<string>();
  newlyCompletedSubtopics: Set<string> = new Set<string>();
  hasAccessToCurrentTopic: boolean = false;
  membershipType: string = 'Basic'; // Or determine based on user's subscription
selectedTimerDuration: number = 10; // Default to 10 minutes
showProgressBar: boolean = true;
autoSubmit: boolean = true;
timerRunning: boolean = false;
timeRemaining: number = 0;
timerProgress: number = 100;
timeTaken: number = 0;
timerInterval: any;



  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCompletedSubtopics();
    this.allTopics = ['Accounting & Finance', 'Investment & Banking', 'Sales & Trading'];
    
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p')) {
          e.preventDefault();
          alert('Screenshots and printing are disabled.');
        }
      });

      document.addEventListener('copy', (e) => e.preventDefault());
      document.addEventListener('cut', (e) => e.preventDefault());
      document.addEventListener('paste', (e) => e.preventDefault());
    }

    this.route.paramMap.subscribe((params) => {
      const topic = params.get('topic');
      if (topic) {
        this.selectedTopic = topic;
        this.checkTopicAccess(topic);
        // Only load chapters if user has access
        if (this.hasAccessToCurrentTopic) {
          this.loadChaptersForTopic(topic);
        }
      }
    });
  }

  checkTopicAccess(topic: string): void {
    const userAccess = this.authService.getUserAccess();
    if (!userAccess) {
      this.hasAccessToCurrentTopic = false;
      return;
    }

    this.hasAccessToCurrentTopic = this.determineAccess(topic, userAccess);
  }

  private determineAccess(topic: string, userAccess: any): boolean {
    switch(topic) {
      case 'Accounting & Finance':
        return userAccess.hasAccountsAndFinanceAccess;
      case 'Investment & Banking':
        return userAccess.hasInvestmentBankingAccess;
      case 'Sales & Trading':
        return userAccess.hasSalesAndTradingAccess;
      default:
        return false;
    }
  }

  onTopicSelect(topic: string): void {
    this.selectedTopic = topic;
    this.checkTopicAccess(topic);
    this.showRightSidebar = true;
    
    // Only load chapters if user has access
    if (this.hasAccessToCurrentTopic) {
      this.loadChaptersForTopic(topic);
    }
  }
  // Method to convert index to option prefix (e.g., 0 -> 'a)', 1 -> 'b)', etc.)
  getOptionPrefix(index: number): string {
    return String.fromCharCode(97 + index) + ')'; // 97 is ASCII for 'a'
  }


  loadChaptersForTopic(topic: string): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token available');
      return;
    }  
    this.questionService.getSubTopicsByTopic(topic, token).subscribe({
      next: (subTopicMap) => {
        this.chapters = subTopicMap[topic].map((subTopic: string) => ({
          title: subTopic,
          subtopics: []
        }));
        
        // Load subsections for each chapter
        this.chapters.forEach(chapter => {
          this.questionService.getSubSectionsBySubTopic(chapter.title, token)
            .subscribe({
              next: (subSectionMap) => {
                chapter.subtopics = subSectionMap[chapter.title] || [];
              }
            });
        });
      }
    });
  }

  onSubtopicSelect(subtopic: string): void {
    console.log('Subtopic selected:', subtopic);
    this.selectedSubsection = subtopic;
    this.showRightSidebar = false; // Hide the right sidebar
    this.resetQuestionState();
    this.showSetupSection = true; // Show the setup section
  }
// Add these methods to your component
formatLabel(value: number): string {
  return `${value} min`;
}

formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

startTimer(): void {
  if (this.timerInterval) {
    clearInterval(this.timerInterval);
  }
  
  this.timeRemaining = this.selectedTimerDuration * 60;
  this.timeTaken = 0;
  this.timerProgress = 100;
  
  this.timerInterval = setInterval(() => {
    if (this.timerRunning) {
      this.timeRemaining--;
      this.timeTaken++;
      
      // Update progress bar
      this.timerProgress = (this.timeRemaining / (this.selectedTimerDuration * 60)) * 100;
      
      // Auto-submit if time runs out
      if (this.timeRemaining <= 0 && this.autoSubmit) {
        this.onSubmit();
        this.stopTimer();
        
        // Show time's up message
        if (this.currentQuestionIndex < this.questions.length - 1) {
          setTimeout(() => this.onNextQuestion(), 1000);
        } else {
          this.showResults();
        }
      }
    }
  }, 1000);
}

stopTimer(): void {
  this.timerRunning = false;
}

toggleTimer(): void {
  this.timerRunning = !this.timerRunning;
}

resetTimer(): void {
  this.stopTimer();
  this.startTimer();
}



  resetQuestionState(): void {
    this.currentQuestionIndex = 0;
    this.currentQuestion = null;
    this.selectedOption = null;
    this.isSubmitted = false;
    this.isCorrectAnswer = null;
  }

  loadQuestionsForSubsection(subsection: string): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token available');
      return;
    }

    this.isLoading = true;
    const trimmedSubsection = subsection.trim();
    
    this.questionService.getQuestionsBySubSection(
      trimmedSubsection, 
      this.selectedQuestionType,
      token
    ).subscribe({
      next: (questionMap: { [key: string]: number[] }) => {
        this.questions = questionMap[trimmedSubsection] || [];
        this.totalQuestions = this.questions.length;
        if (this.questions.length > 0) {
          this.loadQuestion(this.questions[0]);
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching questions:', err);
        this.isLoading = false;
      },
    });
  }

  loadQuestion(questionId: number): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token available');
      return;
    }

    this.isLoading = true;
    this.questionService.getQuestionById(questionId, token).subscribe({
      next: (question: QuestionDetails) => {
        this.currentQuestion = question;
        this.isLoading = false;
        this.isSubmitted = false;
        this.selectedOption = null;
      },
      error: (err: HttpErrorResponse) => {
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
// Save to localStorage
saveCompletedSubtopics() {
  localStorage.setItem('completedSubtopics', JSON.stringify(Array.from(this.completedSubtopics)));
}
// Load from localStorage
loadCompletedSubtopics() {
  const completed = localStorage.getItem('completedSubtopics');
  if (completed) {
    this.completedSubtopics = new Set(JSON.parse(completed));
  }
}
  onSubmit(): void {
    if (this.selectedOption && this.currentQuestion) {
      this.isSubmitted = true;
      const correctAnswerWithoutPrefix = this.stripPrefix(this.currentQuestion.correctAnswer);
      this.isCorrectAnswer = this.selectedOption === correctAnswerWithoutPrefix;
  
      if (this.isCorrectAnswer) {
        this.correctAnswers++;
      }
  // In onSubmit()
if (this.currentQuestionIndex === this.questions.length - 1) {
  this.completedSubtopics.add(this.selectedSubsection);
  this.newlyCompletedSubtopics.add(this.selectedSubsection);
  setTimeout(() => this.newlyCompletedSubtopics.delete(this.selectedSubsection), 500);
  this.saveCompletedSubtopics();
}
      // Mark subtopic as completed when all questions are answered
      if (this.currentQuestionIndex === this.questions.length - 1) {
        this.completedSubtopics.add(this.selectedSubsection);
      }
  
      this.scoreTooltip = 'Your score is ready!';
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
    this.isQuizStarted = false;
    this.stopTimer();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.resetQuestionState();
  }
  
  // Add this to ngOnDestroy to clean up the timer
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
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
 

  // Update your startQuestions method to start the timer
startQuestions(): void {
  this.showSetupSection = false;
  this.isQuizStarted = true;
  this.loadQuestionsForSubsection(this.selectedSubsection);
  
  if (this.showTimer === 'yes') {
    this.startTimer();
    this.timerRunning = true;
  }
}
// Method to go back to subsection selection
backToSubsection(): void {
  this.resetQuestionState(); // Reset question state
  this.showSetupSection = true; // Show the setup section
  this.showRightSidebar = true; // Show the right sidebar
}
}