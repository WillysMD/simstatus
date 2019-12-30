import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Instance} from './instance.model';
import {Revision} from './revision.model';
import {FileInfo} from './file-info.model';
import {Simuconf} from './simuconf.model';

const httpDefaultOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseUri: string;

  constructor(private httpClient: HttpClient) {
    if (isDevMode()) {
      this.baseUri = 'http://localhost:8000/api';
    } else {
      this.baseUri = '/api';
    }
  }

  /*
   * Generics
   */

  /**
   * @deprecated use patch instead
   */
  put(object: any) {
    return this.httpClient.patch<any>(object.url, object, httpDefaultOptions);
  }

  patch(object: any) {
    return this.httpClient.patch<any>(object.url, object, httpDefaultOptions);
  }

  delete(object: any) {
    return this.httpClient.delete(object.url, httpDefaultOptions);
  }

  /*
   * Instances
   */

  instancesList() {
    return this.httpClient.get<Instance[]>(`${this.baseUri}/instances/`, httpDefaultOptions);
  }

  instancePost(instance: Instance) {
    return this.httpClient.post<Instance>(`${this.baseUri}/instances/`, instance, httpDefaultOptions);
  }

  instanceInstall(instance: Instance) {
    return this.httpClient.get<Instance>(`${instance.url}install/`, httpDefaultOptions);
  }

  instanceStart(instance: Instance) {
    return this.httpClient.get<Instance>(`${instance.url}start/`, httpDefaultOptions);
  }

  instanceStop(instance: Instance) {
    return this.httpClient.get<Instance>(`${instance.url}stop/`, httpDefaultOptions);
  }

  /*
   * Revisions
   */

  revisionsList() {
    return this.httpClient.get<Revision[]>(`${this.baseUri}/revisions/`, httpDefaultOptions);
  }

  revisionsPost(data: FormData) {
    return this.httpClient.post<Revision>(`${this.baseUri}/revisions/`, data, httpDefaultOptions);
  }

  revisionGet(url: string) {
    return this.httpClient.get<Revision>(url, httpDefaultOptions);
  }

  revisionBuild(url: string) {
    return this.httpClient.get<Revision>(`${url}build/`, httpDefaultOptions);
  }

  /*
   * Files
   */

  filesList(type: string) {
    if (type === 'pak') {
      return this.httpClient.get<FileInfo[]>(`${this.baseUri}/paks/`, httpDefaultOptions);
    } else if (type === 'save') {
      return this.httpClient.get<FileInfo[]>(`${this.baseUri}/saves/`, httpDefaultOptions);
    }
  }

  filePost(data: FileInfo, type: string) {
    if (type === 'pak') {
      return this.httpClient.post<FileInfo>(`${this.baseUri}/paks/`, data);
    } else if (type === 'save') {
      return this.httpClient.post<FileInfo>(`${this.baseUri}/saves/`, data);
    }
  }

  /*
   * Simuconf
   */

  simuconfList() {
    return this.httpClient.get<Simuconf[]>(`${this.baseUri}/simuconf/`, httpDefaultOptions);
  }

  /*
   * Infos
   */

  infoRevisionLatest() {
    return this.httpClient.get<number>(`${this.baseUri}/info/revision/latest/`);
  }

  infoLoadAvg() {
    return this.httpClient.get<string>(`${this.baseUri}/info/loadavg/`);
  }
}
