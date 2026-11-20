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

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonicalize(item)])
    );
  }
  return value;
}

export function areLearningStatesEqual(
  first: LearningState | null | undefined,
  second: LearningState | null | undefined
): boolean {
  return JSON.stringify(canonicalize(first ?? {})) === JSON.stringify(canonicalize(second ?? {}));
}

// Coalesce overlapping saves: while one RPC is running, keep only the newest
// snapshot instead of sending every intermediate state to Postgres.
const pendingSaves = new Map<string, LearningState>();
const saveWorkers = new Map<string, Promise<void>>();

export async function saveLearningState(patch: LearningState, userId: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured");
  if (!userId) throw new Error("Authenticated user is required");
  pendingSaves.set(userId, patch);

  let worker = saveWorkers.get(userId);
  if (!worker) {
    worker = (async () => {
      while (pendingSaves.has(userId)) {
        const latest = pendingSaves.get(userId)!;
        pendingSaves.delete(userId);
        const { data } = await supabase!.auth.getSession();
        if (data.session?.user.id !== userId) {
          pendingSaves.delete(userId);
          throw new Error("User changed before learning state could be saved");
        }
        const { error } = await supabase!.rpc("save_my_learning_state", {
          p_patch: latest,
        });
        if (error) throw error;
      }
    })().finally(() => {
      saveWorkers.delete(userId);
    });
    saveWorkers.set(userId, worker);
  }

  await worker;
}
