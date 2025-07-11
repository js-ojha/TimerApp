export type Timer = {
  _id: string;
  name: string;
  duration: number;
  remaining_duration: number;
  category: 'Workout' | 'Study' | 'Break';
  status: 'started' | 'paused' | 'completed' | 'created';
  mid_trigger?: 25 | 50 | 75;
  completion_time?: string;
  created_at: string;
  updated_at: string;
};

export type TimerData = {
  timers: Timer[];
  categories: string[];
};

export type TimerAction =
  | { type: 'ADD_TIMER'; payload: Timer }
  | { type: 'UPDATE_TIMER'; payload: Timer }
  | { type: 'DELETE_TIMER'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'LOAD_DATA'; payload: TimerData | null }
  | { type: 'RESET_TIMERS', payload: string[] }
  | { type: 'COMPLETE_TIMER'; payload: string };