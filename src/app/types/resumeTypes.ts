export interface ExperienceType {
  company: string;
  title: string;
  years: string;
  description: string[];
}

export interface EducationType {
  university: string;
  years: string;
  level: string;
  major: string;
  minor?: string;
}
