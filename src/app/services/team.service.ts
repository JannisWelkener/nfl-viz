import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor() { }

    teamColor(team:string){
    if(team == undefined)return "FFFFFF";
    const teamMap: { [key: string]: { name: string; color: string } } = {
      CIN: { name: 'Cincinnati Bengals', color: '#FB4F14' },
      ATL: { name: 'Atlanta Falcons', color: '#A71930' },
      NE:  { name: 'New England Patriots', color: '#FF5555' },
      KC:  { name: 'Kansas City Chiefs', color: '#E31837' },
      DAL: { name: 'Dallas Cowboys', color: '#003594' },
      GB:  { name: 'Green Bay Packers', color: '#203731' },
      BUF: { name: 'Buffalo Bills', color: '#00338D' },
      TEN: { name: 'Tennessee Titans', color: '#4B92DB' },
      SEA: { name: 'Seattle Seahawks', color: '#002244' },
      PIT: { name: 'Pittsburgh Steelers', color: '#FFB612' },
      LA:  { name: 'Los Angeles Rams', color: '#003594' },
      STL: { name: 'St. Louis Rams', color: '#003594' },
      LAC: { name: 'Los Angeles Chargers', color: '#0080C6' },
      MIA: { name: 'Miami Dolphins', color: '#008E97' },
      CHI: { name: 'Chicago Bears', color: '#0B162A' },
      IND: { name: 'Indianapolis Colts', color: '#002C5F' },
      MIN: { name: 'Minnesota Vikings', color: '#4F2683' },
      HOU: { name: 'Houston Texans', color: '#03202F' },
      BAL: { name: 'Baltimore Ravens', color: '#241773' },
      WAS: { name: 'Washington Commanders', color: '#5A1414' },
      CAR: { name: 'Carolina Panthers', color: '#0085CA' },
      NYG: { name: 'New York Giants', color: '#0B2265' },
      NYJ: { name: 'New York Jets', color: '#125740' },
      LV:  { name: 'Las Vegas Raiders', color: '#000000' },
      OAK: { name: 'Oakland Raiders', color: '#000000' },
      ARI: { name: 'Arizona Cardinals', color: '#97233F' },
      DET: { name: 'Detroit Lions', color: '#0076B6' },
      JAX: { name: 'Jacksonville Jaguars', color: '#006778' },
      JAC: { name: 'Jacksonville Jaguars', color: '#006778' },
      NO:  { name: 'New Orleans Saints', color: '#D3BC8D' },
      SF:  { name: 'San Francisco 49ers', color: '#AA0000' },
      PHI: { name: 'Philadelphia Eagles', color: '#004C54' },
      TB:  { name: 'Tampa Bay Buccaneers', color: '#D50A0A' },
      CLE: { name: 'Cleveland Browns', color: '#311D00' },
      DEN: { name: 'Denver Broncos', color: '#000080' },
      SD:  { name: 'San Diego Chargers', color: '#0080C6' },
      APR: { name: 'AFC ProBowl Roster', color: '#D00000' },
      NPR: { name: 'NFC ProBowl Roster', color: '#0073CF' },
      AFC: { name: 'AFC ProBowl Roster', color: '#D00000' },
      NFC: { name: 'NFC ProBowl Roster', color: '#0073CF' },
      RIC: { name: 'Team Jerry Rice', color: '#0073CF' },
      SAN: { name: 'Team Deion Sanders', color: '#D00000' },
      CRT: { name: 'Team Cris Carter', color: '#0073CF'},
      IRV: { name: 'Team Michael Irvin', color: '#D00000' },
    };

    return teamMap[team].color || '#CCCCCC' ;
  }

  secondaryTeamColor(team: string) {
  if (team == undefined) return "000000";
  const secondaryTeamMap: { [key: string]: { name: string; color: string } } = {
    CIN: { name: 'Cincinnati Bengals', color: '#000000' },
    ATL: { name: 'Atlanta Falcons', color: '#A5ACAF' },
    NE:  { name: 'New England Patriots', color: '#C81F32' },
    KC:  { name: 'Kansas City Chiefs', color: '#FFB612' },
    DAL: { name: 'Dallas Cowboys', color: '#869397' },
    GB:  { name: 'Green Bay Packers', color: '#FFB612' },
    BUF: { name: 'Buffalo Bills', color: '#C60C30' },
    TEN: { name: 'Tennessee Titans', color: '#4495D1' },
    SEA: { name: 'Seattle Seahawks', color: '#69BE28' },
    PIT: { name: 'Pittsburgh Steelers', color: '#FFB612' },
    LA:  { name: 'Los Angeles Rams', color: '#FFD100' },
    STL: { name: 'St. Louis Rams', color: '#FFD100' },
    LAC: { name: 'Los Angeles Chargers', color: '#FFC20E' },
    MIA: { name: 'Miami Dolphins', color: '#FC4C02' },
    CHI: { name: 'Chicago Bears', color: '#C83803' },
    IND: { name: 'Indianapolis Colts', color: '#A2AAAD' },
    MIN: { name: 'Minnesota Vikings', color: '#FFC62F' },
    HOU: { name: 'Houston Texans', color: '#A71930' },
    BAL: { name: 'Baltimore Ravens', color: '#9E7C0C' },
    WAS: { name: 'Washington Commanders', color: '#FFB612' },
    CAR: { name: 'Carolina Panthers', color: '#101820' },
    NYG: { name: 'New York Giants', color: '#A71930' },
    NYJ: { name: 'New York Jets', color: '#000000' },
    LV:  { name: 'Las Vegas Raiders', color: '#A5ACAF' },
    OAK: { name: 'Oakland Raiders', color: '#A5ACAF' },
    ARI: { name: 'Arizona Cardinals', color: '#000000' },
    DET: { name: 'Detroit Lions', color: '#B0B7BC' },
    JAX: { name: 'Jacksonville Jaguars', color: '#9F792C' },
    JAC: { name: 'Jacksonville Jaguars', color: '#9F792C' },
    NO:  { name: 'New Orleans Saints', color: '#101820' },
    SF:  { name: 'San Francisco 49ers', color: '#B3995D' },
    PHI: { name: 'Philadelphia Eagles', color: '#A5ACAF' },
    TB:  { name: 'Tampa Bay Buccaneers', color: '#34302B' },
    CLE: { name: 'Cleveland Browns', color: '#311D00' },
    DEN: { name: 'Denver Broncos', color: '#FB4F14' },
    SD:  { name: 'San Diego Chargers', color: '#FFC20E' },
    APR: { name: 'AFC ProBowl Roster', color: '#808080' },
    NPR: { name: 'NFC ProBowl Roster', color: '#808080' },
    AFC: { name: 'AFC ProBowl Roster', color: '#808080' },
    NFC: { name: 'NFC ProBowl Roster', color: '#808080' },
    RIC: { name: 'Team Jerry Rice', color: '#CCCCCC' },
    SAN: { name: 'Team Deion Sanders', color: '#CCCCCC' },
    CRT: { name: 'Team Cris Carter', color: '#CCCCCC' },
    IRV: { name: 'Team Michael Irvin', color: '#CCCCCC' },
  };

  return secondaryTeamMap[team].color || '#999999';
}
}
