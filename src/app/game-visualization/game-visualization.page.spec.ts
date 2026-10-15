import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameVisualizationPage } from './game-visualization.page';

describe('GameVisualizationPage', () => {
  let component: GameVisualizationPage;
  let fixture: ComponentFixture<GameVisualizationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GameVisualizationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
