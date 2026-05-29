import type { LldScene } from "../engine/sceneTypes";
import type { LldVideoConfig } from "../topics/topicTypes";

export type ExportRequest = {
  config: LldVideoConfig;
  scenes: LldScene[];
  voiceoverScript?: string;
  cleanVoiceoverScript?: string;
};

export type ExportStatus = {
  exportId: string;
  state: "queued" | "rendering" | "complete" | "failed";
  progress: number;
  message: string;
  downloadUrl?: string;
  error?: string;
};

export type StoredProject = ExportRequest & {
  exportId: string;
  createdAt: string;
  scriptMetadata?: {
    sceneCount: number;
    totalDurationMs: number;
    hasEditedNarration: boolean;
  };
};
