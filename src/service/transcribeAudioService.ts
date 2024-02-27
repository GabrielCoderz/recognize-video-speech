import { SpeechClient } from "@google-cloud/speech";
import GCSStorageService from "./gcsStorageService";
import path from "path";

async function transcribeAudio() {
  const client = new SpeechClient({
    keyFilename: "./credentials-gcp.json",
  });

  await GCSStorageService.fazerUpload(
    path.resolve(__dirname, "../tmp/output.wav"),
    "audio-files/output.wav",
  );

  const audio = {
    uri: "gs://recognize-video-speech/audio-files/output.wav",
  };

  const config: any = {
    //   encoding: "LINEAR16", // Audio encoding (change if needed).
    //   sampleRateHertz: 44100, // Audio sample rate in Hertz (change if needed).
    languageCode: "en-US",
    audioChannelCount: 2,
  };

  const [operation] = await client.longRunningRecognize({ audio, config });

  const [response]: any = await operation.promise();

  await GCSStorageService.removeFile("audio-files/output.wav");

  return response;
}

export { transcribeAudio };
