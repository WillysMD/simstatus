import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpDefaultOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private instancesUrl = 'http://localhost:8000/api/instances/';
  private revisionsUrl = 'http://localhost:8000/api/revisions/';
  private paksUrl = 'http://localhost:8000/api/paks/';
  private savesUrl = 'http://localhost:8000/api/saves/';
  private infoRevisionLatestUrl = 'http://localhost:8000/api/info/revision/latest/';
  private infoLoadAvgUrl = 'http://localhost:8000/api/info/loadavg/';

  constructor(private httpClient: HttpClient) {
  }

  instancesList() {
    return this.httpClient.get<Instance[]>(this.instancesUrl, httpDefaultOptions);
  }

  instancePost(instance: Instance) {
    return this.httpClient.post<Instance>(this.instancesUrl, instance, httpDefaultOptions);
  }

  instancePut(instance: Instance) {
    return this.httpClient.put<Instance>(instance.url, instance, httpDefaultOptions);
  }

  instanceDelete(instance: Instance) {
    return this.httpClient.delete(instance.url, httpDefaultOptions);
  }

  instanceInstall(instance: Instance) {
    return this.httpClient.get<Instance>(instance.url + 'install/', httpDefaultOptions);
  }

  instanceStart(instance: Instance) {
    return this.httpClient.get<Instance>(instance.url + 'start/', httpDefaultOptions);
  }

  instanceStop(instance: Instance) {
    return this.httpClient.get<Instance>(instance.url + 'stop/', httpDefaultOptions);
  }

  revisionsList() {
    return this.httpClient.get<Revision[]>(this.revisionsUrl, httpDefaultOptions);
  }

  revisionsPost(data: FormData) {
    return this.httpClient.post<Revision>(this.revisionsUrl, data, httpDefaultOptions);
  }

  revisionsDelete(revision: Revision) {
    return this.httpClient.delete(revision.url, httpDefaultOptions);
  }

  revisionGet(url: string) {
    return this.httpClient.get<Revision>(url, httpDefaultOptions);
  }

  revisionBuild(url: string) {
    return this.httpClient.get<Revision>(url + 'build/', httpDefaultOptions);
  }

  paksList() {
    return this.httpClient.get<FileInfo[]>(this.paksUrl, httpDefaultOptions);
  }

  pakPost(pakData: FormData) {
    // Not a JSON request
    return this.httpClient.post<FileInfo>(this.paksUrl, pakData);
  }

  pakDelete(pak: FileInfo) {
    return this.httpClient.delete(pak.url, httpDefaultOptions);
  }

  savesList() {
    return this.httpClient.get<FileInfo[]>(this.savesUrl, httpDefaultOptions);
  }

  savePost(saveData: FormData) {
    // Not a JSON request
    return this.httpClient.post<FileInfo>(this.savesUrl, saveData);
  }

  saveDelete(save: FileInfo) {
    return this.httpClient.delete(save.url, httpDefaultOptions);
  }

  fileInfoGet(url: string) {
    return this.httpClient.get<FileInfo>(url, httpDefaultOptions);
  }

  addRevisionInfo(instance) {
    if (typeof instance.revision === 'string') {
      this.revisionGet(instance.revision).subscribe(revision => {
        instance.revision = revision;
      });
    }
  }

  addPakInfo(instance) {
    if (typeof instance.pak === 'string') {
      this.fileInfoGet(instance.pak).subscribe(pak => {
        instance.pak = pak;
      });
    }
  }

  addSaveInfo(instance) {
    if (typeof instance.savegame === 'string') {
      this.fileInfoGet(instance.savegame).subscribe(savegame => {
        instance.savegame = savegame;
      });
    }
  }

  infoRevisionLatest() {
    return this.httpClient.get<number>(this.infoRevisionLatestUrl);
  }

  infoLoadAvg() {
    return this.httpClient.get<string>(this.infoLoadAvgUrl);
  }
}

export interface Instance {
  url: string;
  name: string;
  port: number;
  revision: string | Revision;
  lang: string;
  debug: number;
  pak: string | FileInfo;
  savegame: string | FileInfo;
  status: number;
}

export enum InstanceStatusCode {
  RUNNING = 0,
  READY = 1,
  BUILDING = 2,
  CREATED = 3,
}

export interface Revision {
  url: string;
  r: number;
  alias: string;
  status: number;
  protected: boolean;
}

export enum RevisionStatusCode {
  READY = 0,
  BUIDLING = 1,
  INSTALL_ERROR = 2,
  COMPILE_ERROR = 3,
  CLONE_ERROR = 4,
}

export interface FileInfo {
  id: string;
  url: string;
  name: string;
  version: string;
  protected: boolean;
  file?: File;
}

export function sortFileInfo(a: FileInfo, b: FileInfo) {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    if (a.version < b.version) {
      return 1;
    } else if (a.version > b.version) {
      return -1;
    } else {
      return 0;
    }
  }
}

export function errorMessage(err) {
  return 'HTTP ' + err.status + ' ' + err.statusText + ' : ' + err.error;
}
