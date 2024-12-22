/**
 * Descriptions for the resume section.
 *
 * @returns Object containing descriptions for the resume section
 */
export const resumeDescriptions = () => {
  return {
    workExperience: {
      valmet: {
        company: "Valmet Technologies Oy",
        title: "Trainee",
        years: "2023-2024",
        description: [
          "Programmed global pricing application with VBA",
          "Updated global pricing models for products",
          "Created and updated SharePoint sites and report templates",
          "Gathered and analysed data for pricing models",
        ],
      },
    },
    education: {
      master: {
        university: "Tampere University",
        years: "2024-2026 (Ongoing)",
        level: "Master of Science in Computer Science",
        major: "Software Engineering",
      },
      bachelor: {
        university: "Tampere University",
        years: "2021-2024",
        level: "Bachelor of Science in Computer Science",
        minor: "Business Studies",
        thesis: "Development of serverless web applications with AWS",
      },
    },
    technologies: [
      "Python",
      "Java",
      "JavaScript",
      "TypeScript",
      "C",
      "C++",
      "C#",
      "Scala",
      "Haskell",
      "Erlang",
      "SQL",
      "VBA",
      "Next.js",
      "Node.js",
      ".NET Framework",
      "ASP.NET Core",
      "Express.js",
      "React",
      "Vue.js",
      "Svelte",
      "Angular",
      "Blazor",
      "Redux.js",
      "Tailwind CSS",
      "Bootstrap",
      "Mocha",
      "Coveralls",
      "RabbitMQ",
      "PostgreSQL",
      "Git",
      "Android",
      "GitHub Actions",
      "Terraform",
      "Kubernetes",
      "Docker",
      "Vercel",
      "AWS",
      "Firebase",
    ],
    hobbies: ["Sports", "Videogames", "Running"],
  };
};

/**
 * Descriptions for the about me section.
 *
 * @returns Object containing descriptions for the about me section
 */
export const aboutMeDescriptions = () => {
  return {
    aboutMe: `My name is Teemu Salonen, a computer science student currently
    pursuing a master's degree majoring in software engineering. I
    am dedicated to continuous improvement in the field. While my strengths lie
    in web development, I look forward to learning new technologies and environments.
    I am especially interested in cloud technologies and want to expand my expertise in this area. 
    My experience ranges from smaller, independent projects to larger
    applications used worldwide. I am passionate about learning and
    evolving as a developer and I eagerly anticipate new opportunities
    and challenges in the future.`,
  };
};

/**
 * Descriptions for the projects section.
 *
 * @returns Object containing descriptions for the projects section
 */
export const projectDescriptions = () => {
  return {
    premierLeagueApp: {
      title: "Premier League standings and fixtures application",
      description: `A simple English Premier League application showing the league table and matches.
      The application shows the standings table of the current season as well as all fixtures of the season and their respective results.
      The app uses football-data.org API to fetch the data for the standings and matches.`,
      link: "/projects/premier-league-app",
      gitHubLink: "https://github.com/SalonenTeemu/premier-league-app",
    },
    f1ScheduleApp: {
      title: "Formula 1 race schedule application",
      description: `A simple F1 race schedule app.
      The app shows 2024 season race dates, times and locations. It also tells which races have already been finished, 
      what race is coming next and the races upcoming later in the season.
      The application uses Ergast Developer API to fetch the race schedule data. 
      Unfortunately, the Ergast API is deprecated and will only be updated until
      the end of the 2024 season so sadly the application will not work after 2024.`,
      link: "/projects/f1-race-schedule-app",
      gitHubLink: "https://github.com/SalonenTeemu/f1-race-schedule-app",
    },
  };
};
