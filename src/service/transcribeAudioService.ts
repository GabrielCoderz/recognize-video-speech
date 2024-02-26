import { SpeechClient } from "@google-cloud/speech";
import { google } from "@google-cloud/speech/build/protos/protos";
import { readFileSync } from "fs";

async function transcribeAudio(audioName: string) {
  try {
    const client = new SpeechClient({
      keyFilename: "./credentials-gcp.json",
    });

    const file = readFileSync(audioName);
    const audioBytes = file.toString("base64");

    const audio = {
      content: audioBytes,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: any = {
      //   encoding: "LINEAR16", // Audio encoding (change if needed).
      //   sampleRateHertz: 44100, // Audio sample rate in Hertz (change if needed).
      languageCode: "en-US",
      audioChannelCount: 2,
    };

    // Return a Promise for the transcription result.
    return new Promise<
      [
        google.cloud.speech.v1.IRecognizeResponse,
        google.cloud.speech.v1.IRecognizeRequest | undefined,
        object | undefined,
      ]
    >((resolve, reject) => {
      client
        .recognize({ audio, config })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

export { transcribeAudio };
