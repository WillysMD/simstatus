export abstract class FileInfo {
  name: string;
  version: string;
  file?: File;
  protected: boolean;
  url: string;
  id: number;

  public toString(): string {
    return `${this.name}-${this.version}`;
  }
}
