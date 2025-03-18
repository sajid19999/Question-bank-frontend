import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipInfoComponent } from './membership-info-page.component';

describe('MembershipInfoPageComponent', () => {
  let component: MembershipInfoComponent;
  let fixture: ComponentFixture<MembershipInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
