/**
 * Represents a work experience role.
 */
export interface ExperienceType {
	title: string;
	years: string;
	description: string[];
}

/**
 * Represents a group of work experiences for a specific company in the resume page.
 */
export interface ExperienceGroupType {
	company: string;
	roles: ExperienceType[];
}

/**
 * Represents an education type in the resume page.
 */
export interface EducationType {
	university: string;
	years: string;
	level: string;
	major?: string;
	minor?: string;
	thesisTitle?: string;
	thesisLink?: string;
	githubRepo?: string;
}
