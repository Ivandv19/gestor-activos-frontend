import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleActivoComponent } from './detalle-activo.component';

describe('DetalleActivoComponent', () => {
  let component: DetalleActivoComponent;
  let fixture: ComponentFixture<DetalleActivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleActivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
