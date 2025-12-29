import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialActivoComponent } from './historial-activo.component';

describe('HistorialActivoComponent', () => {
  let component: HistorialActivoComponent;
  let fixture: ComponentFixture<HistorialActivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialActivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
