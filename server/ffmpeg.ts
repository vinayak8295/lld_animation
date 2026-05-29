import { spawn } from "node:child_process";

export function renderFramesToMp4(framesPattern: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-framerate",
      "30",
      "-i",
      framesPattern,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      outputPath
    ]);

    let stderr = "";
    ffmpeg.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    ffmpeg.on("error", reject);
    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `ffmpeg exited with code ${code}`));
      }
    });
  });
}
