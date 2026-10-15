import { HierarchyRectangularNode } from 'd3-hierarchy';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GameAnalysisService } from 'src/app/services/game-analysis.service';
import { SelectionService } from 'src/app/services/selection.service';
import * as d3 from 'd3';


@Component({
  selector: 'app-treemap',
  templateUrl: './treemap.component.html',
  styleUrls: ['./treemap.component.scss'],
  standalone: false,
})
export class TreemapComponent  implements OnInit, AfterViewInit {
  @ViewChild('wrapper') containerRef!: ElementRef;
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  private teamTreemapData: { [key: string]: any } = {};
  private team: any;

  constructor(private analysis: GameAnalysisService,
              private selection: SelectionService
              ) { }
  

  ngOnInit(): void {
    if (this.analysis.allPlaysOfGame.length > 0){
      const plays = this.analysis.allPlaysOfGame;
      console.log('[Treemap] Plays loaded:', plays.length);
      this.buildYardageData(plays);
      this.drawTreemap(this.teamTreemapData["home"]);
    }
    
  }
  ngAfterViewInit(): void {
    this.selection.homeTeamSelected$.subscribe(value => {
      this.team = value ? "home" : "away";
      this.drawTreemap(this.teamTreemapData[this.team]);
    })
  }

  @HostListener('window-resize', ['$event'])
  onResize(event?: Event) {
    this.drawTreemap(this.teamTreemapData[this.team]);
  }

  buildYardageData(plays: any[]) {
    const grouped: { [key: string]: any[] } = { home: [], away: [] };

    for (const play of plays) {
      const team = play.posteam_type;
      if ((team === 'home' || team === 'away') && !isNaN(+play.yards_gained)) {
        grouped[team].push(play);
      }
    }

    ['home', 'away'].forEach(team => {
      this.teamTreemapData[team] = {
        name: team,
        children: grouped[team]
          .filter(play => play.play_type === 'pass' || play.play_type === 'run')
          .map((play, i) => {
            let player = '';
            switch (play.play_type) {
              case 'pass':
                player = play.receiver_player_name;
                break;
              case 'run':
                player = play.rusher_player_name;
                break;
              default:
                player = '';
            }
            return {
              name: `Play ${i + 1}`,
              value: Math.max(1, +play.yards_gained || 0),
              type: play.play_type,
              player: player,
              desc: play.desc
            }
          })
          .sort((a, b) => b.value - a.value),
      };
    });
  }
  
  drawTreemap(data: any) {
    const container = this.containerRef.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    //const width = 1000;
    //const height = 400;

    const tooltip = d3.select('#tooltip');
    
    const colorByType = (type: string) => {
      switch (type) {
        case 'pass': return '#00BDE5';  // Blue
        case 'run': return '#E66A00';   // Orange
        default: return '#9E9E9E';      // Gray
      }
    };

    const root = d3.hierarchy(data).sum(d => (d as any).value);

    d3.treemap()
      .size([width, height])
      .padding(1)(root);

    const svg = d3.select(container)
      .html('')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const leaves = root.leaves() as d3.HierarchyRectangularNode<any>[];

    const nodes = svg.selectAll('g')
      .data(leaves)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);
    
    const defs = svg.append('defs');

    defs.append('pattern')  // stripes
      .attr('id', 'diagonal-stripe')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 10)  // spacing 
      .attr('height', 10)
      .attr('patternTransform', 'rotate(-45)') // rotation
      .append('rect')
      .attr('width', 4) // thickness
      .attr('height', 10)
      .attr('fill', 'rgba(55,55,55,0.01)'); // Color and visibility

    nodes.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => colorByType(d.data.type))
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('filter', 'drop-shadow(inset 0 0 4px rgba(0,0,0,0.3))')
      .style('transition', 'fill 0.3s ease')
      .on('mouseover', function (event, d) {
        const player = d.data.player || 'Unknown';
        tooltip
          .style('opacity', 1)
          .html(d.data.desc.replace(/\n/g, '<br/>'))
      })
      .on('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
      
        this.tooltipRef.nativeElement.style.left = `${x + 10}px`;
        this.tooltipRef.nativeElement.style.top = `${y - 28}px`;
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });
    
    nodes.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', 'url(#diagonal-stripe)')
      .attr('rx', 4)
      .attr('ry', 4)
      .style('pointer-events', 'none');
        
    //Centered text
    const text = nodes.append('text')
      .attr('x', d => (d.x1 - d.x0) / 2)
      .attr('y', d => (d.y1 - d.y0) / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .attr('fill', '#000')
      .style('pointer-events', 'none');

      
      text.each(function(d) {
        const group = d3.select(this);
        let player = 'default'
        if(d.data.value >= 6){  //if the play is larger than 5 yards show the player
          group.append('tspan')
            .text(`${d.data.player}`)
            .attr('x', (d.x1 - d.x0) / 2)
            .attr('dy', '-0.4em'); // shift up

            group.append('tspan')
            .text(`${d.data.value} yd`)
            .attr('x', (d.x1 - d.x0) / 2)
            .attr('dy', '1.2em'); // shift down
          }
          else if(d.data.value >= 2){  //else render just the yardage of the play
            group.append('tspan')
            .text(`${d.data.value} yd`)
            .attr('x', (d.x1 - d.x0) / 2)
            .attr('dy', '0');
          }
          else {
            group.append('tspan')
            .text(`${d.data.value}`)
            .attr('x', (d.x1 - d.x0) / 2)
            .attr('dy', '0');
          }
      })

      
    

    //Top left text
    const typeTracker = new Set<string>();

    nodes.filter(d => {
      const isFirst = !typeTracker.has(d.data.type);
      typeTracker.add(d.data.type);
      return isFirst;
    }).append('text')
      .attr('x', 26)
      .attr('y', 14)  
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => {
        switch(d.data.type){
          case 'run': return 'Rushing';
          case 'pass': return 'Passing';
          default: return '';
        }
      })
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .attr('fill', '#000')
      .style('pointer-events', 'none');
  }
}

