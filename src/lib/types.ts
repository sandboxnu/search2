export interface Term {
  term: string;
  name: string;
}

export interface GroupedTerms {
  neu: Term[];
  cps: Term[];
  law: Term[];
}

export interface Subject {
  label: string;
  value: string;
}
