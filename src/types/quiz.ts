export interface Question {
  id: string;
  round_id: number;
  question_number: number;
  type: "mcq" | "fill_blank" | "picture";
  question_text: string;
  image_url?: string;
  options?: string[];
  marks: number;
}

export interface Team {
  id: string;
  team_name: string;
  team_leader_name: string;
  team_leader_email: string;
  members: string[];
  status: "ACTIVE" | "ELIMINATED" | "DISABLED";
  current_round: number;
}

export interface Round {
  id: number;
  round_number: number;
  name: string;
  question_count: number;
  duration: number;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  elimination_count: number;
}