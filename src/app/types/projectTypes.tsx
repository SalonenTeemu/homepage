/**
 * Represents a project in the projects page.
 */
export interface ProjectType {
  title: string;
  description: string;
  link: string;
  gitHubLink: string;
}

/**
 * Represents the Premier League competition.
 */
export interface Competition {
  name: string;
  flag: string;
  emblem: string;
  season: string;
  currentMatchday: number;
}

/**
 * Represents a Premier League team.
 */
export interface Team {
  name: string;
  position: number;
  crest: string;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

/**
 * Represents a Premier League match.
 */
export interface Match {
  matchday: number;
  date: string;
  live: boolean;
  homeTeam: {
    name: string;
    crest: string;
    score: number | null;
  };
  awayTeam: {
    name: string;
    crest: string;
    score: number | null;
  };
}

/**
 * Represents a race event in the Formula 1 schedule.
 */
export interface Race {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time: string;
  Circuit: {
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
}

/**
 * Represents a driver in the Formula 1 standings.
 */
export interface Driver {
  position: number;
  points: number;
  wins: number;
  Driver: {
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructor: {
    name: string;
  };
}

/**
 * Represents a constructor in the Formula 1 standings.
 */
export interface Constructor {
  position: number;
  points: number;
  wins: number;
  Constructor: {
    name: string;
    nationality: string;
  };
}
