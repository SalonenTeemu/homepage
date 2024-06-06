// Represents a project in the projects page
export interface ProjectType {
  title: string;
  description: string;
  link: string;
}

// Represents a race event in the Formula 1 schedule.
export interface RaceType {
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
