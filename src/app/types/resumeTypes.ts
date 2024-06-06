// Represents a work experience type in the resume page
export interface ExperienceType {
  company: string;
  title: string;
  years: string;
  description: string[];
}

// Represents an education type in the resume page
export interface EducationType {
  university: string;
  years: string;
  level: string;
  major: string;
  minor?: string;
}
