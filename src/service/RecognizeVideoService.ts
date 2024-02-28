import GetVideoFromYoutubeService from "./GetVideoFromYoutubeService";
import FileConverterService from "./FileConverterService";
import TranscribeAudioService from "./TranscribeAudioService";

export type IRecognizeVideoParams = {
  urlVideo: string;
  sourceNameVideo: string;
  outputNameVideo: string;
};

export default class RecognizeVideoService {
  private getVideoFromYoutubeService: GetVideoFromYoutubeService;
  private fileConverterService: FileConverterService;
  private transcribeAudioService: TranscribeAudioService;

  constructor() {
    this.getVideoFromYoutubeService = new GetVideoFromYoutubeService();
    this.fileConverterService = new FileConverterService();
    this.transcribeAudioService = new TranscribeAudioService();
  }

  async execute(params: IRecognizeVideoParams): Promise<unknown> {
    await this.getVideoFromYoutubeService.execute({ url: params.urlVideo });
    await this.fileConverterService.execute({
      sourceNameVideo: params.sourceNameVideo,
      outputNameVideo: params.outputNameVideo,
    });

    const response = await this.transcribeAudioService.execute();

    if (!response.results)
      throw Error(
        "Resultado vazio da transcrição. Favor tentar outro arquivo ou verifique sua rede.",
      );

    const transcription = response.results
      .map((result: any) => result.alternatives[0].transcript)
      .join("\n");

    return Promise.resolve(transcription);
  }
}
