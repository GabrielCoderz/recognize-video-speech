import { Request, Response } from "express";
import { transcribeAudio } from "../service/transcribeAudioService";

async function transcribeAudioController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // const audioData: string = req.body.audioData;
    const transcription: any = await transcribeAudio("./src/english.wav");

    const sanitizedText = transcription[0].results
      .map((r: any) => r.alternatives[0].transcript)
      .join("\n");

    res.json({ sanitizedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro durante a transcrição" });
  }
}

export { transcribeAudioController };
