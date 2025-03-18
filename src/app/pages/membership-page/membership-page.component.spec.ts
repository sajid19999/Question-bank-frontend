import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembershipComponent } from './membership-page.component'; // Correct import

describe('MembershipComponent', () => { // Update the describe block name
  let component: MembershipComponent;
  let fixture: ComponentFixture<MembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipComponent], // Use the correct component
    }).compileComponents();

    fixture = TestBed.createComponent(MembershipComponent); // Use the correct component
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
