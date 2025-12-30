
export interface DreamMapArea {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export interface DailyCheckIn {
  date: string;
  s1: boolean | null;
  s2: boolean | null;
  s3: boolean | null;
  s4: boolean | null;
  s5: boolean | null;
}

export interface EndOfDayAssessment {
  date: string;
  simpler: boolean | null;
  happier: boolean | null;
  confident: boolean | null;
  lighter: boolean | null;
}

export interface PersonalRule {
  id: string;
  text: string;
  createdAt: string;
}

export interface UserData {
  hasCompletedOnboarding: boolean;
  dreamMap: DreamMapArea[];
  dailyCheckIns: DailyCheckIn[];
  endOfDayAssessments: EndOfDayAssessment[];
  personalRules: PersonalRule[];
}
