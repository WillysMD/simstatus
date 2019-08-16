export class Revision {
  r: number;
  alias: string;
  protected: boolean;
  status: number;
  url: string;
  id: number;

  public toString(): string {
    return this.r.toString();
  }
}

export enum RevisionStatusCode {
  READY = 0,
  BUIDLING = 1,
  INSTALL_ERROR = 2,
  COMPILE_ERROR = 3,
  CLONE_ERROR = 4,
}
