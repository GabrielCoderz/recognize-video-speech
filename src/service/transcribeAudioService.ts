import { SpeechClient } from "@google-cloud/speech";
import GCSStorageService from "./gcsStorageService";
import path from "path";

export default class transcribeAudioService {
  private client: SpeechClient;
  private request;

  constructor() {
    const audio = {
      uri: "gs://recognize-video-speech/audio-files/output.wav",
    };

    const config = {
      //   encoding: "LINEAR16", // Audio encoding (change if needed).
      //   sampleRateHertz: 44100, // Audio sample rate in Hertz (change if needed).
      languageCode: "en-US",
      audioChannelCount: 2,
    };

    this.request = {
      audio,
      config,
    };

    this.client = new SpeechClient({
      keyFilename: "./credentials-gcp.json",
    });
  }

  async execute() {
    await GCSStorageService.fazerUpload(
      path.resolve(__dirname, "../tmp/output.wav"),
      "audio-files/output.wav",
    );

    console.log(`Log: Realizando o transcribe...`);

    const [operation] = await this.client.longRunningRecognize(this.request);

    const [response] = await operation.promise();

    console.log(`Log: Transcribe finalizado`);

    await GCSStorageService.removeFile("audio-files/output.wav");

    return response;
  }
}
