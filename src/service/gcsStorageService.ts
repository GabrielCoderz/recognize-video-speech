import { Storage } from "@google-cloud/storage";
import StorageService from "../interfaces/storageService";

export default class GCSStorageService implements StorageService {
  private storage: Storage;

  constructor() {
    const projectId = "recognize-video-speech";
    const keyFilename = "./credentials-gcp.json";

    this.storage = new Storage({
      projectId,
      keyFilename,
    });
  }

  async fazerUpload(pathFile: string, pathBucket: string): Promise<void> {
    try {
      await this.storage.bucket("recognize-video-speech").upload(pathFile, {
        destination: pathBucket,
      });

      console.log(`Arquivo ${pathFile} enviado para ${pathBucket}.`);
    } catch (erro) {
      console.error("Erro ao fazer upload do arquivo:", erro);
      throw erro;
    }
  }

  async removeFile(pathBucket: string): Promise<void> {
    try {
      const file = this.storage
        .bucket("recognize-video-speech")
        .file(pathBucket);

      await file.delete();

      console.log(`Arquivo ${pathBucket} removido com sucesso.`);
    } catch (erro) {
      console.error("Erro ao remover o arquivo:", erro);
      throw erro;
    }
  }
}
