export interface Rule {
  id: string;
  category: string;
  symptom: string;
  conditions: string[];
  diagnosis: string;
  solution: string[];
}

export interface Request {
  symptom: string;
  conditions: string[];
  keywords: string[];
}

export interface Response {
  id: string;
  category: string;
  diagnosis: string;
  solution: string[];
}
