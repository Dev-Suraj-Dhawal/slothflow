export type AIProvider = 'browser-transformers' | 'local-ollama' | 'distilled-sloth' | 'huggingface-api';

export type SlothMode = 
  | 'chat-tidier' 
  | 'voice-ramble' 
  | 'fridge-chef' 
  | 'dreaded-reply' 
  | 'wind-down' 
  | 'why-open';

export interface SoundTrackState {
  id: 'rain' | 'thunder' | 'forest' | 'brown-noise';
  name: string;
  icon: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

export interface SlothStats {
  timeSavedMinutes: number;
  caloriesConserved: number;
  tasksEliminated: number;
  chillLevel: number; // 1 to 100
}

export interface ChatTidierResult {
  twoLineBrief: string;
  urgencyLevel: 'Chill (Ignore)' | 'Low Effort' | 'One Quick Action Needed';
  suggestedReplies: string[];
  extractedTasks: string[];
}

export interface VoiceRambleResult {
  transcript: string;
  cleansedIntent: string;
  bulletItems: string[];
  category: 'Tasks' | 'Groceries' | 'Random Shower Thought' | 'Work Note';
}

export interface FridgeChefResult {
  recipeTitle: string;
  prepTimeMinutes: number;
  stepCount: number;
  ingredientsUsed: string[];
  lazySteps: string[];
  slothChefsTip: string;
}

export interface DreadedReplyResult {
  tone: string;
  draftReply: string;
  whyItRelievesStress: string;
}

export interface BedtimeStoryResult {
  title: string;
  storyMarkdown: string;
  breathingPacingSeconds: number;
  ambientRecommendation: string;
}

export interface InferenceState {
  status: 'idle' | 'loading-weights' | 'running' | 'done' | 'error';
  progress?: number;
  message?: string;
  error?: string;
  modelName: string;
  durationMs?: number;
}
