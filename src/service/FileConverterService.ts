import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { unlink } from "fs";

type IConversorVideoConfig = {
  sourceNameVideo: string;
  outputNameVideo: string;
};

export default class FileConverterService {
  private formatter: string;

  constructor() {
    this.formatter = "wav";
  }

  async execute(params: IConversorVideoConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(path.resolve(__dirname, `../tmp/${params.sourceNameVideo}.mp4`))
        .toFormat("wav")
        .saveToFile(
          path.resolve(__dirname + `/../tmp/${params.outputNameVideo}.wav`),
        )
        .once("end", () => {
          const result = "Vídeo convertido.";
          console.log(`Log: ${result}`);

          unlink(
            path.resolve(__dirname, `../tmp/${params.sourceNameVideo}.mp4`),
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
}
