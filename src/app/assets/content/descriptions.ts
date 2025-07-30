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
					"Programmed global pricing application",
					"Updated global pricing models for products",
					"Created and updated SharePoint sites and report templates",
					"Gathered and analysed data for pricing models",
				],
			},
			trenrg: {
				company: "Tampereen Energia Oy",
				title: "Trainee, Integrations",
				years: "2025",
				description: [
					"Migrating system integrations by updating target frameworks on the Frends platform",
					"Designing and implementing new cross-system integrations",
					"Resolving issues with current integrations",
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
			"JavaScript",
			"TypeScript",
			"React",
			"Redux.js",
			"Next.js",
			"Vue.js",
			"Svelte",
			"Angular",
			"Tailwind CSS",
			"Bootstrap",
			"Node.js",
			"Express.js",
			"Mocha",
			"Swagger",
			"Coveralls",
			"Java",
			"C#",
			".NET",
			".NET Framework",
			"Blazor",
			"C++",
			"C",
			"Haskell",
			"Scala",
			"Erlang",
			"SQL",
			"PostgreSQL",
			"VBA",
			"RabbitMQ",
			"Docker",
			"Kubernetes",
			"Terraform",
			"Git",
			"GitHub Actions",
			"Jenkins",
			"AWS",
			"Firebase",
			"Vercel",
			"Android",
			"Databricks",
			"Frends",
		],
		hobbies: ["Sports", "Games", "Running"],
	};
};

/**
 * Descriptions for the about me section.
 *
 * @returns Object containing descriptions for the about me section
 */
export const aboutMeDescriptions = () => {
	return {
		aboutMe1: `My name is Teemu Salonen, a Computer Science student pursuing a master's degree focusing on Software Engineering at Tampere University.
		My passion for technology began with a curiosity about how software is built, leading me to this field.`,

		aboutMe2: `I am committed to continuous learning and have gained knowledge in various programming languages and tools. 
		While my primary strength lies in full-stack web development, I am always eager to explore new technologies and environments.`,

		aboutMe3: `My experience ranges from independent hobby and academic projects to working on large-scale applications used worldwide in a professional setting. In my professional role, I have worked on system integrations, enabling communication between different platforms.
		I am driven by a passion for growth and innovation, and am committed to continuous improvement through challenges that help me grow as a developer.`,
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
			description: `A simple English Premier League application that displays the league table and match results.
			The app shows the standings of the current season as well as all fixtures and their respective results. 
			It fetches data from the football-data.org API for up-to-date information on standings and matches.`,
			link: "/projects/premier-league-app",
			gitHubLink: "https://github.com/SalonenTeemu/premier-league-app",
		},
		f1App: {
			title: "Formula 1 application",
			description: `A simple Formula 1 application that provides the race schedule, driver standings, and constructor standings for the current season.
			The app displays completed races, the upcoming race, and the schedule for later in the season. Data is fetched from jolpica-f1 API.
			Please note, the driver and constructor standings may not be available before the season starts, so these pages may display an error during that time.`,
			link: "/projects/f1-app",
			gitHubLink: "https://github.com/SalonenTeemu/f1-app",
		},
		aiChatbotApp: {
			title: "AI chatbot application",
			description: `A simple AI chatbot powered by the Google Gemini API, utilizing the 2.0 Flash model.
			You can type messages, and the chatbot will respond accordingly.
			Please remember not to share any personal information with the chatbot.`,
			link: "/projects/ai-chatbot-app",
			gitHubLink: "https://github.com/SalonenTeemu/ai-chatbot",
		},
		aiChessApp: {
			title: "Chess against AI application",
			description: `This chess application allows users to play against an AI opponent, powered by the minimax algorithm with alpha-beta pruning.
			Players can choose to play as white or black and select from three difficulty levels: easy, medium, or hard. The app also features options to undo moves and reset the game.
			Additionally, sound effects are included for moves, captures, checkmate, and more, enhancing the experience.`,
			link: "/projects/ai-chess-app",
			gitHubLink: "https://github.com/SalonenTeemu/ai-chess",
		},
		forum: {
			title: "Chat forum",
			description: `This chat forum allows logged-in users to post messages, reply to existing threads, and edit or delete their own posts. 
			Users can create new threads and participate in discussions. All posts are stored in AWS DynamoDB. 
			To prevent spam, the forum includes rate limiting, allowing users to post up to 10 messages per day.
			Please remember to not share any personal information on the forum.
			Additionally, please note that the forum is not actively maintained, so issues may occur.`,
			link: "/forum",
		},
	};
};
