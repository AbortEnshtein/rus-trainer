// frontend/app/types/index.ts
export interface Word {
  id: number;
  display_word: string;
  correct_letter: string;
  pair_letter: string;
  options: string[];
  explanation: string | null;
  rule: string;
  base_word: string;
  has_no_letter: boolean;
  user_stats?: {
    correct_count: number;
    wrong_count: number;
    mastered: boolean;
  };
}

export interface Rule {
  name: string;
  word_count: number;
}

export interface UserProgress {
  progress: {
    total_correct: number;
    total_wrong: number;
    mastered_words: number;
    today_correct: number;
    today_wrong: number;
    accuracy: number;
  };
  rule_stats: Array<{
    rule_name: string;
    correct_count: number;
    wrong_count: number;
    last_practiced: string;
  }>;
  recent_history: Array<{
    word_id: number;
    user_answer: string;
    is_correct: boolean;
    timestamp: string;
  }>;
}

export interface AnswerResponse {
  is_correct: boolean;
  correct_letter: string;
  explanation: string | null;
  rule: string;
}

export interface SessionData {
  session_id: string;
  user_id: number;
  username: string;
}