import express from "express";
import { transcribeAudioController } from "./controller/transcribeAudioController";

const app = express();

app.use(express.json());

app.get("/transcribe", transcribeAudioController);

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});
