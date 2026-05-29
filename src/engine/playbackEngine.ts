import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LldScene } from "./sceneTypes";

export type PlaybackState = {
  isPlaying: boolean;
  currentSceneIndex: number;
  sceneElapsedMs: number;
  totalElapsedMs: number;
  progress: number;
  isFinished: boolean;
};

export function getTotalDuration(scenes: LldScene[]) {
  return scenes.reduce((sum, scene) => sum + scene.durationMs, 0);
}

export function locateSceneAt(scenes: LldScene[], totalElapsedMs: number) {
  let cursor = 0;
  for (let index = 0; index < scenes.length; index += 1) {
    const scene = scenes[index];
    const next = cursor + scene.durationMs;
    if (totalElapsedMs < next) {
      const sceneElapsedMs = totalElapsedMs - cursor;
      return {
        currentSceneIndex: index,
        sceneElapsedMs,
        progress: Math.min(1, Math.max(0, sceneElapsedMs / scene.durationMs))
      };
    }
    cursor = next;
  }

  const lastIndex = Math.max(0, scenes.length - 1);
  return {
    currentSceneIndex: lastIndex,
    sceneElapsedMs: scenes[lastIndex]?.durationMs ?? 0,
    progress: 1
  };
}

export function usePlayback(scenes: LldScene[], autoPlay = false, onFinished?: () => void) {
  const totalDuration = useMemo(() => getTotalDuration(scenes), [scenes]);
  const [state, setState] = useState<PlaybackState>(() => ({
    isPlaying: autoPlay,
    currentSceneIndex: 0,
    sceneElapsedMs: 0,
    totalElapsedMs: 0,
    progress: 0,
    isFinished: false
  }));
  const lastTickRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    setState({
      isPlaying: autoPlay,
      currentSceneIndex: 0,
      sceneElapsedMs: 0,
      totalElapsedMs: 0,
      progress: 0,
      isFinished: false
    });
    finishedRef.current = false;
  }, [scenes, autoPlay]);

  useEffect(() => {
    if (!state.isPlaying || scenes.length === 0) {
      lastTickRef.current = null;
      return;
    }

    let raf = 0;
    const tick = (now: number) => {
      const last = lastTickRef.current ?? now;
      const delta = now - last;
      lastTickRef.current = now;

      setState((previous) => {
        const nextElapsed = Math.min(totalDuration, previous.totalElapsedMs + delta);
        const location = locateSceneAt(scenes, nextElapsed);
        const isFinished = nextElapsed >= totalDuration;
        return {
          isPlaying: !isFinished,
          totalElapsedMs: nextElapsed,
          isFinished,
          ...location
        };
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scenes, state.isPlaying, totalDuration]);

  useEffect(() => {
    if (state.isFinished && !finishedRef.current) {
      finishedRef.current = true;
      onFinished?.();
    }
  }, [onFinished, state.isFinished]);

  const play = useCallback(() => {
    setState((previous) => ({ ...previous, isPlaying: true, isFinished: false }));
  }, []);

  const pause = useCallback(() => {
    setState((previous) => ({ ...previous, isPlaying: false }));
  }, []);

  const restart = useCallback(() => {
    finishedRef.current = false;
    setState({
      isPlaying: autoPlay,
      currentSceneIndex: 0,
      sceneElapsedMs: 0,
      totalElapsedMs: 0,
      progress: 0,
      isFinished: false
    });
  }, [autoPlay]);

  const jumpToScene = useCallback(
    (sceneIndex: number) => {
      const totalElapsedMs = scenes.slice(0, sceneIndex).reduce((sum, scene) => sum + scene.durationMs, 0);
      const location = locateSceneAt(scenes, totalElapsedMs);
      finishedRef.current = false;
      setState((previous) => ({
        ...previous,
        totalElapsedMs,
        isFinished: false,
        ...location
      }));
    },
    [scenes]
  );

  return { state, play, pause, restart, jumpToScene, totalDuration };
}
