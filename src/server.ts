import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";
import * as paths from "path";
import ffmpeg from "fluent-ffmpeg";
import path from "@ffmpeg-installer/ffmpeg";
import { createWriteStream, unlink } from "fs";

import { transcribeAudioController } from "./controller/transcribeAudioController";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

ffmpeg.setFfmpegPath(path.path);

app.get("/transcribe", transcribeAudioController);

type IYoutubeVideoConfig = {
  url: string;
  filter?: string;
};

type IConversorVideoConfig = {
  sourceNameVideo: string;
  outputNameVideo: string;
};

async function getAudio(urlVideo: string) {
  try {
    const getVideoResult = await getVideoFromYoutube({ url: urlVideo });
    console.log(getVideoResult);

    const conversorVideoResult = await conversorVideo({
      sourceNameVideo: "source",
      outputNameVideo: "output",
    });
    console.log(conversorVideoResult);
  } catch (err) {
    console.error(err);
  }
}

async function getVideoFromYoutube(
  params: IYoutubeVideoConfig,
): Promise<string> {
  const output = paths.resolve(__dirname, "./tmp/source.mp4");

  return new Promise((resolve, reject) => {
    ytdl(params.url, { filter: "videoandaudio" })
      .pipe(createWriteStream(output))
      .once("finish", () => {
        const result = "Vídeo criado.";
        resolve(result);
      })
      .once("error", () => {
        const result = "Erro ao criar o vídeo.";
        reject(result);
      });
  });
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

        unlink(
          paths.resolve(__dirname, `./tmp/${params.sourceNameVideo}.mp4`),
          (err) => {
            if (err) reject(err);
            console.log("O arquivo source foi deletado.");
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
