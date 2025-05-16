import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficosFeasPage } from './graficos-feas.page';

describe('GraficosFeasPage', () => {
  let component: GraficosFeasPage;
  let fixture: ComponentFixture<GraficosFeasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficosFeasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
