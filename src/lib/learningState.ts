import { supabase } from "./supabase";

export type LearningState = {
  completedLessons?: string[];
  rewardedLessons?: string[];
  lirBalance?: number;
  savedWords?: string[];
  placementResult?: { score: number; date: string } | null;
  a1FinalResult?: { score: number; date: string } | null;
  listeningCompleted?: string[];
  listeningScores?: Record<string, boolean>;
};

export async function loadLearningState(): Promise<LearningState | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_learning_state")
    .select("state")
    .maybeSingle();

  if (error) throw error;
  return (data?.state as LearningState | undefined) ?? null;
}

export async function saveLearningState(patch: LearningState): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.rpc("save_my_learning_state", {
    p_patch: patch,
  });
  if (error) throw error;
}
