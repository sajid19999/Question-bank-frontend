import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipInfoPageComponent } from './membership-info-page.component';

describe('MembershipInfoPageComponent', () => {
  let component: MembershipInfoPageComponent;
  let fixture: ComponentFixture<MembershipInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipInfoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
