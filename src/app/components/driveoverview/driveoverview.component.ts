import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { GameAnalysisService } from 'src/app/services/game-analysis.service';
import { SelectionService } from 'src/app/services/selection.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-driveoverview',
  templateUrl: './driveoverview.component.html',
  styleUrls: ['./driveoverview.component.scss'],
  standalone: false
})
export class DriveoverviewComponent implements OnInit {

  constructor(
    private teamService: TeamService,
    public analysis: GameAnalysisService,
    private selectionService: SelectionService
  ) { }

  selectedPlay = 0;
  mult = 10;
  indicatorDesc = "";

  @ViewChild('dynwrap', { static: true }) wrapperRef!: ElementRef;
  @ViewChild('scalable', { static: true }) scalableRef!: ElementRef;
  readonly originalWidth = 1308;
  readonly originalHeight = 570;

  ngOnInit() {
    this.visualizeDrives();
    this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.applyScale();
  }

  applyScale() {
    const wrapperEl = this.wrapperRef.nativeElement as HTMLElement;
    const scalableEl = this.scalableRef.nativeElement as HTMLElement;

    const wrapperWidth = wrapperEl.offsetWidth;
    const wrapperHeight = wrapperEl.offsetHeight;

    const scaleX = wrapperWidth / this.originalWidth;
    const scaleY = wrapperHeight / this.originalHeight;

    const scale = Math.min(scaleX, scaleY);

    scalableEl.style.transform = `scale(${scale})`;
  }

  visualizeDrives() {
    if (this.analysis.allPlaysOfGame.length > 0) {
      this.selectedPlay = this.analysis.amountOfPlays;
      this.selectionService.playSelected.next(this.analysis.allPlaysOfGame[this.selectedPlay]);
      this.renderChart();
    }
  }

  calculateStartPosition(drive: any): number {
    let firstPlay = drive[0];

    //If drive starts with kickoff, skip to actual first play
    if (firstPlay.play_type === "kickoff") {
      let i: number = 1;
      while (i < drive.length && drive[i].play_type === "NA") {
        i++;
      }
      if (i < drive.length) {
        firstPlay = drive[i];
      }
    }

    //Something like: CIN 41
    let yardline: string = firstPlay.yrdln;

    //Get hometeam to decide field side
    let hometeam = drive[0].home_team;
    const [team, position] = this.yrdlnToLR(yardline);

    //Hometeam 22 => 100 - 22 = 78 Yardline, Awayteam 22 => 22 Yardline
    let startPoint = team != hometeam ? 100 - +position : +position;
    return startPoint;
  }

  calculateEndPosition(drive: any): number {
    let lastPlay = drive[drive.length - 1];

    let hometeam = drive[0].home_team;

    let yardline: string = lastPlay.yrdln;

    if (lastPlay.play_type == "punt") {
      yardline = drive[drive.length - 2].yrdln;
    }

    const [team, position] = this.yrdlnToLR(yardline);

    //Touchdown, if last play was a PAT-attempt or a 2-PC-attempt
    if (lastPlay.play_type == "extra_point" || lastPlay.two_point_conv_result != "NA") {
      return hometeam != team ? 100 : 0;
    }

    let endPoint = team != hometeam ? 100 - +position : +position;
    return endPoint;
  }

  yrdlnToLR(yrd: string) {
    return yrd.trim().split(/\s+/);
  }

  getCurrentTeamColor(drive: any) {
    let teamInPossession = drive[0].posteam;
    return this.teamService.teamColor(teamInPossession);
  }

  driveDisplay(drive: any) {
    let start = this.calculateStartPosition(drive);
    let end = this.calculateEndPosition(drive);
    let driveLength = Math.abs(start - end);
    let marginLeft = Math.min(start, end);

    let teamColor = this.getCurrentTeamColor(drive);

    // if(driveLength<2)driveLength=2;

    return {
      width: driveLength * this.mult + "px",
      marginLeft: marginLeft * this.mult + "px",
      background: teamColor
    };
  }

  calcStyleDriveStart(drive: any) {
    let away = drive[0].posteam_type == "away";
    return {
      float: away ? "right" : "left",
      marginLeft: away ? "5px" : "-5px"
    }
  }

  calcStyleDriveStartAbs(drive: any) {
    let away = drive[0].posteam_type == "away";
    return {
      marginLeft: away ? "-20px" : "0px"
    }
  }

  calcStyleOutcome(drive: any) {
    let away = drive[0].posteam_type == "away";
    away = !away;
    return {
      float: away ? "right" : "left",
      marginLeft: away ? "5px" : "-5px",
    }
  }

  calcStyleOutcomeText(drive: any) {
    let away = drive[0].posteam_type == "away";
    return {
      transform: away ? "translateX(-100%)" : "none",
      marginLeft: away ? "0px" : "5px"
    }
  }

  calcDriveOutcome(drive: any) {
    let lastPlay = drive[drive.length - 1];

    if (lastPlay.fumble == 1) return "Fumble";
    if (lastPlay.interception == 1) return "Int";

    if (lastPlay.desc.includes("END QUARTER 2")) return "Halftime";
    if (lastPlay.desc.includes("END QUARTER 4")) return "End of regulation";
    if (lastPlay.desc.includes("END GAME")) return "End Game";

    if (lastPlay.desc.includes("TWO-POINT CONVERSION ATTEMPT")) return "TD";

    switch (lastPlay.play_type) {
      case "no_play": return "Int";
      case "punt": return "Punt";
      case "extra_point": return "TD";
      case "2_point_conv": return "TD";
      case "field_goal": return "FG";
      case "pass": return "Int";
      case "NA": return "??";
    }

    if (lastPlay.fourth_down_failed == 1) return "Turnover on downs";

    return lastPlay.play_type;
  }

  onChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.selectedPlay = +target.value;

    this.selectionService.playSelected.next(this.analysis.allPlaysOfGame[this.selectedPlay]);
  }

  positionIndicator() {
    let play = this.analysis.allPlaysOfGame[this.selectedPlay];
    if (play == undefined) return;
    let driveNum = play.drive;
    let marginTop = driveNum * 30 - 33;
    let hometeam = play.home_team;

    const [team, position] = this.yrdlnToLR(play.yrdln);
    let adjustedPos = team != hometeam ? 100 - +position : +position;

    let marginLeft = adjustedPos * this.mult - 15;

    this.focusIndicator();

    let togo = play.ydstogo;
    let down = play.down;
    switch(down){
      case "1":
        down = "1st";
        break;
      case "2":
        down = "2nd";
        break;
      case "3":
        down = "3rd";
        break;
      case "4":
        down = "4th";
        break;
      case "NA":
        down = "Special Teams";
    }

    this.indicatorDesc = down + " and "+togo;
    if(down == "Special Teams")this.indicatorDesc = down;

    if (play.desc.includes("END QUARTER 2")) this.indicatorDesc = "";
    if (play.desc.includes("END QUARTER 4")) this.indicatorDesc = "";
    if (play.desc.includes("END GAME")) this.indicatorDesc = "";
    if (play.desc.includes("warning")) this.indicatorDesc = "";
    if (play.desc.includes("Timeout")) this.indicatorDesc = "Timeout";

    return {
      marginTop: marginTop + "px",
      marginLeft: marginLeft + "px"
    }
  }

  focusIndicator(){
    const container = document.querySelector('.scroll-field') as HTMLElement;
    const target = document.querySelector('#indic') as HTMLElement;
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const scrollOffset = targetRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      });
    }
  }



  renderChart() {
    const data = this.analysis.allPlaysOfGame.map((d, i) => ({ index: i, epa: isNaN(+d.epa) ? 0 : +d.epa }));

    const containerHTML = d3.select('#epa-chart').node() as HTMLElement;
    const container = d3.select('#epa-chart');
    container.selectAll('*').remove();

    // const width = containerHTML.clientWidth;

    const width = 1316;

    const height = 60;

    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height);

    // Use scaleBand for discrete equal spacing
    const x = d3.scaleBand()
      .domain(data.map(d => d.index.toString()))
      .range([0, width])
      .padding(0);

    const y = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.epa)!,
        d3.max(data, d => d.epa)!
      ])
      .range([height, 0]);

    const line = d3.line<{ index: number; epa: number }>()
      .x(d => (x(d.index.toString()) ?? 0) + x.bandwidth() / 2)
      .y(d => y(d.epa))
      .curve(d3.curveCatmullRom);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#2196f3')
      .attr('stroke-width', 2)
      .attr('d', line);


    const areaPathId = "epa-area-clip";

    const area = d3.area<{ index: number; epa: number }>()
      .x(d => x(d.index.toString())! + x.bandwidth() / 2)
      .y0(height)
      .y1(d => y(d.epa))
      .curve(d3.curveCatmullRom);

    svg.append("defs")
      .append("clipPath")
      .attr("id", areaPathId)
      .append("path")
      .datum(data)
      .attr("d", area);

    const segmentWidth = width / data.length;

    data.forEach((d, i) => {
      const avgEpa = d.epa;
      svg.append("rect")
        .attr("x", x(i.toString())!)
        .attr("y", 0)
        .attr("width", segmentWidth)
        .attr("height", height)
        .attr("fill", this.colorScale(avgEpa))
        .attr("clip-path", `url(#${areaPathId})`);
    });
    svg.append("defs").append("linearGradient")
      .attr("id", "epa-horizontal-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data(data.map((d, i) => ({
        offset: `${(i / (data.length - 1)) * 100}%`,
        color: this.colorScale(d.epa)
      })))
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#epa-horizontal-gradient)")
      .attr("clip-path", `url(#${areaPathId})`);
  }

  calcStyleDriveLength(drive: any) {
    const driveIndicator = d3.select('#drive-indicator').node() as HTMLElement;
    let maxWidth = driveIndicator.clientWidth;
    let len = drive.length / this.analysis.allPlaysOfGame.length;
    let teamColor = this.getCurrentTeamColor(drive);
    return {
      width: maxWidth * len + "px",
      background: teamColor
    }
  }

  quarterTick(play: any) {
    let isEndOfQuarter = play.desc.includes("END QUARTER");
    return {
      height: isEndOfQuarter ? "62px" : "12px",
      marginTop: isEndOfQuarter ? "-50px" : "0px"
    }
  }

  colorScale(epa: number): string {
    const scale = d3.scaleLinear<string>()
      .domain([-1.5, 0, 2])
      .range(["#d4a017", "yellow", "#00ff00"]);

    return scale(epa);
  }

  calcStyleEndzone(home: boolean) {
    let team = home ? this.analysis.home : this.analysis.away

    return {
      background: this.teamService.secondaryTeamColor(team)
    }
  }

}



