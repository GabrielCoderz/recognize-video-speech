import express from "express";
import cors from "cors";
import ffmpeg from "fluent-ffmpeg";
import path from "@ffmpeg-installer/ffmpeg";

import transcribeAudioController from "./controller/TranscribeAudioController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

ffmpeg.setFfmpegPath(path.path);

app.get("/transcribe", new transcribeAudioController().handle);

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});
