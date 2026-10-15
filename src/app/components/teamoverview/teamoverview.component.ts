import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { GameAnalysisService } from 'src/app/services/game-analysis.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-teamoverview',
  templateUrl: './teamoverview.component.html',
  styleUrls: ['./teamoverview.component.scss'],
  standalone: false
})
export class TeamoverviewComponent  implements AfterViewInit {

  constructor(
    private teamService: TeamService,
    public analysis:GameAnalysisService
    ) { }

  ngAfterViewInit() {
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.drawRadarChart();
  }

  @ViewChild('radarwrap') wrapper!: ElementRef<HTMLElement>;

  drawRadarChart() {

    d3.select("#radarChart").selectAll("*").remove();
    const width = this.wrapper.nativeElement.offsetWidth;
    const height = this.wrapper.nativeElement.offsetHeight;
    const margin = 50;
    const radius = Math.min(width / 2, height / 2) - margin;
    const levels = 5;
    const axisNames = ['Passing-Yards', 'Rushing-Yards', 'Completion-%', 'Yards allowed', 'Takeaways', 'Allowed-Comp'];
    const angleSlice = (Math.PI * 2) / axisNames.length;

    const homeData = this.analysis.radarChartDataHome;
    const awayData = this.analysis.radarChartDataAway;

    const svg = d3.select('#radarChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    axisNames.forEach((axis, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      chartGroup.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x).attr('y2', y)
        .attr('stroke', '#999');

      chartGroup.append('text')
        .attr('x', x * 1.1)
        .attr('y', y * 1.1)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('class', 'axis-label')
        .text(axis);
    });


    for (let i = 0; i < 6; i++) {
      const angle = angleSlice * i - Math.PI / 2;

      for (let level = 1; level <= levels; level++) {
        const r = radius * (level / levels);
        const cx = r * Math.cos(angle);
        const cy = r * Math.sin(angle);

        const perpAngle = angle + Math.PI / 2;
        const dx = (5 / 2) * Math.cos(perpAngle);
        const dy = (5 / 2) * Math.sin(perpAngle);

        chartGroup.append('line')
          .attr('x1', cx - dx)
          .attr('y1', cy - dy)
          .attr('x2', cx + dx)
          .attr('y2', cy + dy)
          .attr('stroke', '#ccc')
          .attr('stroke-width', 1);
      }
    }

    const line = d3.lineRadial()
      .radius((d: any) => d.value * radius)
      .angle((d: any) => d.angle)
      .curve(d3.curveLinearClosed);

    const buildDataPoints = (data: number[]) => {
      return data.map((d, i) => ({
        angle: i * angleSlice,
        value: d
      }));
    };

    const redData = buildDataPoints(homeData);
    const blueData = buildDataPoints(awayData);

    let colorHome = this.teamService.teamColor(this.analysis.home);
    let colorAway = this.teamService.teamColor(this.analysis.away);

    chartGroup.append('path')
      .datum(redData)
      .attr('d', line as any)
      .attr('fill', colorHome)
      .attr('fill-opacity', 0.5)
      .attr('stroke', colorHome)
      .attr('stroke-width', 2);

    chartGroup.append('path')
      .datum(blueData)
      .attr('d', line as any)
      .attr('fill', colorAway)
      .attr('fill-opacity', 0.5)
      .attr('stroke', colorAway)
      .attr('stroke-width', 2);

  }

}
