import { Component, ElementRef, Input, OnInit, ViewChild , AfterViewInit} from '@angular/core';
import * as d3 from 'd3';
import { GameAnalysisService } from 'src/app/services/game-analysis.service';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
  standalone: false,
})
export class HeatmapComponent  implements OnInit, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltipInitialized = false;
  selectedTeam = false;
  cells: any[] = [];
  cells_home: any[] = [];
  cells_away: any[] = [];

  yardlineLabels = [
    { label: '+20 yd', position: '48%' },
    { label: '+10 yd', position: '66%' },
    { label: 'LOS', position: '83%' }
  ];

  constructor(private analysis: GameAnalysisService,
              private selection: SelectionService
              ) { }
  
  ngOnInit(): void {
    if (this.analysis.allPlaysOfGame.length > 0){
      const plays = this.analysis.allPlaysOfGame;
      this.cells_home = this.computeQBRGrid(plays, "home");
      this.cells_away = this.computeQBRGrid(plays, "away");
    }
    this.selection.homeTeamSelected$.subscribe(value => {
      this.cells = value ? this.cells_home : this.cells_away;
    })
    
  }
  
  ngAfterViewInit() {
    console.log('[Heatmap] Tooltip is ready:', this.tooltipRef.nativeElement);
  }
  
  //Generation of cells for the heatmap
  computeQBRGrid(plays: any[], selectedTeam: String){
    const qbrByZone: Record<number, { att: number, comp: number, yards: number, td: number, int: number }> = {};
 
    for (const play of plays) {
      if (play.play_type !== 'pass' || selectedTeam !== play.posteam_type) continue;

      const zone = this.mapPlayToZone(play);
      const data = this.extractQBRInputs(play);

      if (!qbrByZone[zone]) {
        qbrByZone[zone] = { att: 0, comp: 0, yards: 0, td: 0, int: 0 };
      }

      qbrByZone[zone].att += data.att;
      qbrByZone[zone].comp += data.comp;
      qbrByZone[zone].yards += data.yards;
      qbrByZone[zone].td += data.td;
      qbrByZone[zone].int += data.int;
    }

    return Array(12).fill(null).map((_, i) => {
      const data = qbrByZone[i] || { att: 0, comp: 0, yards: 0, td: 0, int: 0 };
      const qbr = data.att > 0
        ? this.basicQBR(data.att, data.comp, data.yards, data.td, data.int)
        : null;

      return {
        qbr: qbr !== null ? qbr.toFixed(1) : '',
        color: qbr !== null ? this.getColorFromQBR(qbr) : '#666',
        plays: data.att,
        qbrDetails: {
          value: qbr,
          ...data
        },
      };
    })
  }

  //Tooltip event handler
  showTooltip(event: MouseEvent, cell: any) {
    console.log('[Heatmap] showTooltip() invoked')
    const tooltip = d3.select(this.tooltipRef.nativeElement);
    tooltip
      .style('display', 'block')
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY + 10}px`)
      .html(`
      <strong>QBR:</strong> ${cell.qbrDetails.value !== null ? cell.qbrDetails.value.toFixed(1) : ''}<br>
      <strong>Attempts:</strong> ${cell.qbrDetails.att}<br>
      <strong>Completions:</strong> ${cell.qbrDetails.comp}<br>
      <strong>Yards:</strong> ${cell.qbrDetails.yards}<br>
      <strong>TD:</strong> ${cell.qbrDetails.td}<br>
      <strong>INT:</strong> ${cell.qbrDetails.int}`
    );
  }
  //Tooltip event handler
  moveTooltip(event: MouseEvent) {
      const tooltip = d3.select(this.tooltipRef.nativeElement);
      tooltip
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY + 10}px`)
  }
  //Tooltip event handler
  hideTooltip() {
    d3.select(this.tooltipRef.nativeElement).style('display', 'none');
  }


  extractQBRInputs(play: any): {
    att: number;
    comp: number;
    yards: number;
    td: number;
    int: number;
  } {
    const att = 1; // each play is one attempt
    const comp = +play.complete_pass === 1 ? 1: 0;
    const yards = +play.yards_gained || 0;
    const td = +play.pass_touchdown === 1 ? 1 : 0;
    const int = +play.interception === 1 ? 1 : 0;

    return {att, comp, yards, td, int};
  }

  //Passing rating calculated as in the NFL
  basicQBR(att: number, comp: number, yards: number, td: number, int: number): number {
    const a = Math.max(0, Math.min(2.375, ((comp / att) - 0.3) * 5));
    const b = Math.max(0, Math.min(2.375, ((yards / att) - 3) * 0.25));
    const c = Math.max(0, Math.min(2.375, (td / att) * 20));
    const d = Math.max(0, Math.min(2.375, 2.375 - ((int / att) * 25)));
    return Math.max(0, Math.min(158.3, (a + b + c + d) / 6 * 100));
  }

  mapPlayToZone(play: any): number {
    const x = this.getRowFromYardline(+play.air_yards);
    const y = this.getColumnFromLocation(play.pass_location)
    return x * 3 + y;
  }

  getRowFromYardline(yards: number): number {
    if (yards <= 0) return 3;   //lowest row
    if (yards <= 10) return 2;  //2nd row from lower edge
    if (yards <= 20) return 1;  //3rd row from lower edge
    return 0;                   //highest row
  }
  
  getColumnFromLocation(location: string): number {
    switch (location) {
      case 'left': return 0;
      case 'middle': return 1;
      case 'right': return 2;
      default: return 13; // unknown or missing location sets value outside of grid
    }
  }

  getColorFromQBR(qbr: number): string {
    const maxQBR = 158.3;
    const minQBR = 0; //might change to another value later to better show the differences
    const midpoint = (minQBR + maxQBR) / 2;
    const ratio = Math.max(0, Math.min(1, (qbr - minQBR) / (maxQBR - minQBR)));

    //color values. starts at yellow and goes to green by changing red channel
    let red, green;
    const blue = 0;

    if (qbr < midpoint) {
      //red to yellow by increasing green
      red = 255;
      green = Math.round((qbr / midpoint) * 255);
    } else {
      //yellow to green by decreasing red
      red = Math.round(255 * (1 - (qbr - midpoint) / (maxQBR - midpoint)));
      green = 255;
    }

    return `rgb(${red}, ${green}, ${blue})`;
  }
}