import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar'; // ✅ Import Toolbar
import { MatIconModule } from '@angular/material/icon'; // ✅ Import Icon
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [MatListModule, MatSidenavModule, CommonModule, MatExpansionModule,RouterLink,MatToolbarModule,MatIconModule],
  templateUrl: './course-overview.component.html',
  styleUrl: './course-overview.component.css',
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CourseOverviewComponent implements OnInit {
  selectedCourse: string | null = null;
  startQuiz(subtopic: string) {
    console.log(`Starting quiz for: ${subtopic}`);
    // You can navigate to a quiz page or trigger quiz logic here
    this.router.navigate(['/quiz', { subtopic }]);
  }
  // Dummy Chapters & Subtopics for Each Course
  chapters: any = {
    'Accounting & Finance': [
      { title: 'Chapter 1: Financial Accounting Principles', subtopics: ['GAAP and IFRS', 'Revenue Recognition & Accrual Accounting', 'The 3 Financial Statements', 'Consolidation & Intercompany Transactions'] },
      { title: 'Chapter 2: Managerial Accounting & Cost Analysis', subtopics: ['Cost Classifications', 'Budgeting & Forecasting Techniques', 'Variance & Break-even Analysis', 'Activity-Based Costing & Performance Measurement'] },
      { title: 'Chapter 3: Financial Statement Analysis & Ratios', subtopics: ['Profitability Metrics', 'Liquidity & Solvency Ratios', 'Efficiency & Leverage Analysis', 'Trend Analysis & Common-Size Statements'] },
      { title: 'Chapter 4: Corporate Finance & Capital Budgeting', subtopics: ['Time Value of Money', 'Cost of Capital', 'Capital Structure Decisions', 'Dividend Policy & Share Repurchase Strategies'] },
      { title: 'Chapter 5: Working Capital & Treasury Management', subtopics: ['Cash Conversion Cycle & Liquidity Optimization', 'Short-Term Financing Options & Credit Lines', 'Cash Forecasting & Treasury Operations', 'Inventory & Receivables Management'] },
      { title: 'Chapter 6: Financial Modeling & Valuation', subtopics: ['Discounted Cash Flow (DCF) Analysis', 'Comparable Company Analysis', 'Precedent Transaction Analysis', 'Leveraged Buyout (LBO) Modeling'] },
      { title: 'Chapter 7: Ethics, Regulation & Corporate Governance', subtopics: ['Sarbanes-Oxley, Internal Controls & Compliance', 'Corporate Governance Structures', 'Ethical Dilemmas & Professional Conduct', 'Regulatory Reporting & Transparency'] },
      { title: 'Chapter 8: International Finance & Risk Management', subtopics: ['Foreign Exchange Markets & Currency Risk', 'Country & Political Risk Analysis', 'Hedging Strategies (Forwards, Options, Swaps)', 'Global Financial Integration & Cross-border Transactions'] }
    ],
    'Sales & Trading': [
      { title: 'Chapter 1: Market Fundamentals', subtopics: ['Equities: Order Types & Market Microstructure', 'Fixed Income: Bond Pricing & Yield Curves', 'Overview of Market Indices & Sectors', 'Market Liquidity & Trading Venues'] },
      { title: 'Chapter 2: Derivatives & Structured Products', subtopics: ['Options: Basics, Calls, Puts & Greeks', 'Futures, Forwards & Swaps Mechanics', 'Structured Products & Credit Derivatives', 'Exotic Options & Alternative Derivative Strategies'] },
      { title: 'Chapter 3: Trading Strategies & Technical Analysis', subtopics: ['Arbitrage, Momentum & Statistical Strategies', 'Technical Indicators (Moving Averages, RSI, MACD)', 'Chart Patterns & Trend Analysis', 'Behavioural Finance & Market Sentiment'] },
      { title: 'Chapter 4: Risk Management & Regulatory Framework', subtopics: ['Value at Risk (VaR) & Stress Testing', 'Regulatory Standards (Basel III, MiFID II, Volcker Rule)', 'Hedging Strategies Across Asset Classes', 'Counterparty & Operational Risk Management'] },
      { title: 'Chapter 5: Foreign Exchange & Commodities', subtopics: ['Currency Pairs & Exchange Rate Mechanisms', 'Spot, Forward & Swap FX Transactions', 'Commodity Markets & Futures Contracts', 'Hedging in Energy, Metals & Agriculture'] },
      { title: 'Chapter 6: Electronic & Algorithmic Trading', subtopics: ['Algorithmic Order Execution Techniques', 'High-Frequency Trading & Dark Pools', 'Electronic Trading Platforms & Infrastructure', 'Data Analytics & Machine Learning in Trading'] },
      { title: 'Chapter 7: Macroeconomic Indicators & Market Impact', subtopics: ['Key Indicators: GDP, CPI, Unemployment Rates', 'Central Bank Policies & Interest Rate Decisions', 'Geopolitical Events & Their Market Implications', 'Global Trade & Economic Cycles'] },
      { title: 'Chapter 8: Trade Execution & Operations', subtopics: ['Order Routing & Trade Execution Mechanisms', 'Clearing, Settlement & Post-Trade Processing', 'Prime Brokerage & Margin Requirements', 'Compliance, Reporting & Audit Trails'] }
    ],
    'Investment Banking': [
      { title: 'Chapter 1: Mergers & Acquisitions (M&A)', subtopics: ['Deal Lifecycle: Target Identification & Due Diligence', 'Valuation Techniques & Synergy Analysis', 'Accretion/Dilution & Transaction Structuring', 'Negotiation Tactics & Integration Strategies'] },
      { title: 'Chapter 2: Equity Capital Markets (ECM)', subtopics: ['IPO Process, Underwriting & Pricing', 'Follow-On Offerings & Rights Issues', 'Bookbuilding & Investor Roadshows', 'Post-IPO Performance & Secondary Offerings'] },
      { title: 'Chapter 3: Debt Capital Markets (DCM)', subtopics: ['Corporate Bond Issuance (High-Yield vs. Investment-Grade)', 'Syndicated Loans & Securitization Structures', 'Credit Ratings, Covenants & Market Sentiment', 'Regulatory Environment & Market Trends'] },
      { title: 'Chapter 4: Leveraged Finance', subtopics: ['Leveraged Buyout (LBO) Structures & Modeling', 'Mezzanine Financing & Unitranche Deals', 'High-Yield Bond Market Dynamics', 'Covenant-Lite Loans & Risk Considerations'] },
      { title: 'Chapter 5: Restructuring & Distressed M&A', subtopics: ['Bankruptcy Processes', 'Distressed Debt & Turnaround Strategies', 'Stakeholder Negotiations & Restructuring Tactics', 'Asset Sales & Liquidation Analysis'] },
      { title: 'Chapter 6: Financial Sponsors & Private Equity', subtopics: ['PE Fund Structures & Capital Raising', 'Deal Sourcing & Due Diligence in PE', 'Value Creation & Operational Improvement', 'Exit Strategies: IPOs, Secondary Sales & Strategic Exits'] }
    ]
  };
  isMobile: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const courseName = params.get('courseName');
      if (courseName) {
        this.selectedCourse = decodeURIComponent(courseName);
      }
    });

    // Detect screen size changes
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  selectCourse(course: string, sidenav: any) {
    const formattedCourse = encodeURIComponent(course);
    this.router.navigate(['/course-overview', formattedCourse]);

    // Close sidenav on mobile after selection
    if (this.isMobile) {
      sidenav.close();
    }
  }

}
