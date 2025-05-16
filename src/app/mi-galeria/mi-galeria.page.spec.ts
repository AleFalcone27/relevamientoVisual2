import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiGaleriaPage } from './mi-galeria.page';

describe('MiGaleriaPage', () => {
  let component: MiGaleriaPage;
  let fixture: ComponentFixture<MiGaleriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiGaleriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
