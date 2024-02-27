import express from "express";
import cors from "cors";
import ffmpeg from "fluent-ffmpeg";
import path from "@ffmpeg-installer/ffmpeg";

import GetVideoFromYoutubeService from "./service/GetVideoFromYoutubeService";
import FileConverterService from "./service/FileConverterService";

import { transcribeAudioController } from "./controller/transcribeAudioController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

ffmpeg.setFfmpegPath(path.path);

app.get("/transcribe", transcribeAudioController);

async function getAudio(urlVideo: string) {
  try {
    await new GetVideoFromYoutubeService().execute({
      url: urlVideo,
    });

    await new FileConverterService().execute({
      sourceNameVideo: "source",
      outputNameVideo: "output",
    });
  } catch (err) {
    console.error(err);
  }
}

app.get("/", async (req, res) => {
  try {
    await getAudio("https://www.youtube.com/shorts/FVWcZXuZmv8");
    res.send("ok");
  } catch (err) {
    res.send(err);
  }
});

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});
