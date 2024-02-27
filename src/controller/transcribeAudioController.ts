import { Request, Response } from "express";
import transcribeAudioService from "../service/transcribeAudioService";

async function transcribeAudioController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // const audioData: string = req.body.audioData;
    const response = await new transcribeAudioService().execute();

    if (!response.results)
      throw Error(
        "Resultado vazio da transcrição. Favor tentar outro arquivo ou verifique sua rede.",
      );

    const transcription = response.results
      .map((result: any) => result.alternatives[0].transcript)
      .join("\n");

    res.json({ transcription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro durante a transcrição" });
  }
}

export { transcribeAudioController };
