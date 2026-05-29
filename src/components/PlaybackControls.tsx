import { Pause, Play, RotateCcw } from "lucide-react";

type Props = {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
};

export function PlaybackControls({ isPlaying, onPlay, onPause, onRestart }: Props) {
  return (
    <div className="playback-controls">
      <button type="button" onClick={isPlaying ? onPause : onPlay} title={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        <span>{isPlaying ? "Pause" : "Play"}</span>
      </button>
      <button type="button" onClick={onRestart} title="Restart">
        <RotateCcw size={18} />
        <span>Restart</span>
      </button>
    </div>
  );
}
