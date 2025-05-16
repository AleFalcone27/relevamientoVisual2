import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficosLindasPage } from './graficos-lindas.page';

describe('GraficosPage', () => {
  let component: GraficosLindasPage;
  let fixture: ComponentFixture<GraficosLindasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficosLindasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
