interface StorageService {
  fazerUpload(pathFile: string, pathBucket: string): Promise<void>;
}

export default StorageService;
