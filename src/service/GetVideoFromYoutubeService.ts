import ytdl from "ytdl-core";
import path from "path";
import { createWriteStream } from "fs";

type IYoutubeVideoConfig = {
  url: string;
  filter?: string;
};

export default class GetVideoFromYoutubeService {
  constructor() {}

  async execute(params: IYoutubeVideoConfig): Promise<string> {
    const output = path.resolve(__dirname, "../tmp/source.mp4");

    return new Promise((resolve, reject) => {
      ytdl(params.url, { filter: "videoandaudio" })
        .pipe(createWriteStream(output))
        .once("finish", () => {
          const result = "Vídeo criado.";
          console.log(`Log: ${result}`);

          resolve(result);
        })
        .once("error", () => {
          const result = "Erro ao criar o vídeo.";
          console.log(`Log: ${result}`);

          reject(result);
        });
    });
  }
}
