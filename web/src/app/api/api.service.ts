import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Instance} from './instance.model';
import {Revision} from './revision.model';
import {FileInfo} from './file-info.model';

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

  /*
   * Generics
   */

  put(object: any) {
    return this.httpClient.patch<any>(object.url, object, httpDefaultOptions);
  }

  delete(object: any) {
    return this.httpClient.delete(object.url, httpDefaultOptions);
  }

  /*
   * Instances
   */

  instancesList() {
    return this.httpClient.get<Instance[]>(this.instancesUrl, httpDefaultOptions);
  }

  instancePost(instance: Instance) {
    return this.httpClient.post<Instance>(this.instancesUrl, instance, httpDefaultOptions);
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

  /*
   * Revisions
   */

  revisionsList() {
    return this.httpClient.get<Revision[]>(this.revisionsUrl, httpDefaultOptions);
  }

  revisionsPost(data: FormData) {
    return this.httpClient.post<Revision>(this.revisionsUrl, data, httpDefaultOptions);
  }

  revisionGet(url: string) {
    return this.httpClient.get<Revision>(url, httpDefaultOptions);
  }

  revisionBuild(url: string) {
    return this.httpClient.get<Revision>(url + 'build/', httpDefaultOptions);
  }

  /*
   * Files
   */

  filesList(type: string) {
    if (type === 'pak') {
      return this.httpClient.get<FileInfo[]>(this.paksUrl, httpDefaultOptions);
    } else if (type === 'save') {
      return this.httpClient.get<FileInfo[]>(this.savesUrl, httpDefaultOptions);
    }
  }

  filePost(data: FileInfo, type: string) {
    if (type === 'pak') {
      return this.httpClient.post<FileInfo>(this.paksUrl, data);
    } else if (type === 'save') {
      return this.httpClient.post<FileInfo>(this.savesUrl, data);
    }
  }

  /*
   * Infos
   */

  infoRevisionLatest() {
    return this.httpClient.get<number>(this.infoRevisionLatestUrl);
  }

  infoLoadAvg() {
    return this.httpClient.get<string>(this.infoLoadAvgUrl);
  }
}
