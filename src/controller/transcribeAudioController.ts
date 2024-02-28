import { Request, Response } from "express";
import RecognizeVideoService, {
  IRecognizeVideoParams,
} from "../service/RecognizeVideoService";

export default class TranscribeAudioController {
  async handle(req: Request, res: Response): Promise<void> {
    const { urlVideoYT } = req.body;

    const recognizeVideoService = new RecognizeVideoService();

    const data: IRecognizeVideoParams = {
      urlVideo: urlVideoYT,
      sourceNameVideo: "source",
      outputNameVideo: "output",
    };

    const result = await recognizeVideoService.execute(data);

    res.json({ transcription: result });
  }
}
