/**
 * Descriptions for the resume section.
 *
 * @returns Object containing descriptions for the resume section
 */
export const resumeDescriptions = () => {
	return {
		workExperience: {
			trenrg: {
				company: "Tampereen Energia Oy",
				roles: [
					{
						title: "ICT Specialist",
						years: "2026–present",
						description: [
							"Developing and maintaining integration solutions that support business needs",
							"Contributing to ICT development projects",
							"Supporting the administration and development of the Microsoft 365 environment",
						],
					},
					{
						title: "Systems Integration Specialist",
						years: "2025–2026",
						description: [
							"Designed, implemented, and enhanced system integrations",
							"Maintained, enhanced, and troubleshot existing integrations",
							"Developed integration solutions that supported business needs",
						],
					},
				],
			},
			valmet: {
				company: "Valmet Technologies Oy",
				roles: [
					{
						title: "Trainee",
						years: "2023–2024",
						description: [
							"Programmed a global pricing application",
							"Updated global pricing models for products",
							"Created and maintained SharePoint sites and report templates",
							"Gathered and analysed data for pricing models",
						],
					},
				],
			},
		},
		education: {
			master: {
				university: "Tampere University",
				years: "2024–2026",
				level: "Master of Science in Computer Science",
				major: "Software Engineering",
				thesisTitle:
					"Cost and Performance Analysis of Visual AI Inference Across Different Computing Architectures",
				thesisLink: "https://urn.fi/URN:NBN:fi:tuni-202605276443",
				githubRepo: "https://github.com/SalonenTeemu/visual-inference-architecture-benchmark",
			},
			bachelor: {
				university: "Tampere University",
				years: "2021–2024",
				level: "Bachelor of Science in Computer Science",
				minor: "Business Studies",
				thesisTitle:
					"Development of Serverless Web Applications in AWS: An Overview of Services, Benefits, and Challenges",
				thesisLink: "https://urn.fi/URN:NBN:fi:tuni-202405135740",
			},
		},
		technologies: {
			programmingLanguages: ["JavaScript", "TypeScript", "Java", "Python", "C", "C++", "C#", "SQL"],
			backend: ["Frends", "REST & SOAP APIs", "Node.js", ".NET", "PostgreSQL"],
			frontend: ["React", "Angular", "Next.js", "HTML", "CSS", "Tailwind CSS"],
			cloud: ["Git", "Docker", "GitHub Actions", "Jenkins", "AWS", "Azure", "Vercel"],
		},
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
		aboutMe1: `My name is Teemu Salonen, a Master of Science in Computer Science from Tampere University. 
		My passion for technology began with a curiosity about how software is built, which eventually led me to pursue a career in software development and systems integration.`,

		aboutMe2: `I have experience working with a wide range of programming languages, frameworks, and cloud technologies. 
		My expertise spans software development, system integrations, and web technologies, and I enjoy learning new tools and approaches to solve technical challenges.`,

		aboutMe3: `Currently, I contribute to business system integrations, ICT development projects, and the continuous development of the Microsoft 365 environment, helping deliver reliable technology solutions that support business needs.
		My background includes independent hobby projects, academic work, and professional experience with business-critical systems.
		I am motivated by continuous learning, problem-solving, and creating practical solutions that deliver value through technology.`,
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
