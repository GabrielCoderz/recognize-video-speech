import express from "express";
import cors from "cors";
import * as paths from "path";
import ffmpeg from "fluent-ffmpeg";
import path from "@ffmpeg-installer/ffmpeg";
import { unlink } from "fs";
import GetVideoFromYoutubeService from "./service/GetVideoFromYoutubeService";

import { transcribeAudioController } from "./controller/transcribeAudioController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

ffmpeg.setFfmpegPath(path.path);

app.get("/transcribe", transcribeAudioController);

type IConversorVideoConfig = {
  sourceNameVideo: string;
  outputNameVideo: string;
};

async function getAudio(urlVideo: string) {
  try {
    await new GetVideoFromYoutubeService().execute({
      url: urlVideo,
    });

    await conversorVideo({
      sourceNameVideo: "source",
      outputNameVideo: "output",
    });
  } catch (err) {
    console.error(err);
  }
}

async function conversorVideo(params: IConversorVideoConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(paths.resolve(__dirname, `./tmp/${params.sourceNameVideo}.mp4`))
      .toFormat("wav")
      .saveToFile(
        paths.resolve(__dirname + `/tmp/${params.outputNameVideo}.wav`),
      )
      .once("end", () => {
        const result = "Vídeo convertido.";
        console.log(`Log: ${result}`);

        unlink(
          paths.resolve(__dirname, `./tmp/${params.sourceNameVideo}.mp4`),
          (err) => {
            if (err) reject(err);
            console.log("Log: O arquivo source foi deletado.");
            resolve(result);
          },
        );
      })
      .once("error", (err) => {
        const result = `Erro ao converter vídeo. ${err.message}`;
        reject(result);
      });
  });
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
