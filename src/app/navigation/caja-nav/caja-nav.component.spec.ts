import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaNavComponent } from './caja-nav.component';

describe('CajaNavComponent', () => {
  let component: CajaNavComponent;
  let fixture: ComponentFixture<CajaNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CajaNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajaNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
