import {Revision} from './revision.model';
import {FileInfo} from './file-info.model';

export class Instance {
  name: string;
  port: number;
  lang = 'en';
  debug = 2;
  revision: Revision;
  pak: FileInfo;
  savegame: FileInfo;
  status: number;
  url: string;

  constructor(data?: any) {
    if (data) {
      this.name = data.name;
      this.port = data.port;
      this.lang = data.lang || 'en';
      this.debug = data.debug || 2;
    }
  }

  public toString(): string {
    return this.name;
  }
}

export enum InstanceStatusCode {
  RUNNING = 0,
  READY = 1,
  WAITING = 2,
  CREATED = 3,
}
