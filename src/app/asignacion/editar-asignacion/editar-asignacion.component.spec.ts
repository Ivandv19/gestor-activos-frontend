import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAsignacionComponent } from './editar-asignacion.component';

describe('EditarAsignacionComponent', () => {
  let component: EditarAsignacionComponent;
  let fixture: ComponentFixture<EditarAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarAsignacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
