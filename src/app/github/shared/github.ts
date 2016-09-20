import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/cache';
import 'rxjs/add/operator/do';

import Dexie from "dexie";

class GithubDb extends Dexie {
  repos: Dexie.Table<{
    id: number;
    name: string;
    owner: { login:string; };
  }, string>;

  constructor(){
    super("Github");

    this.version(1)
      .stores({
        repos: "id, name, owner.login"
      });
  }
}

@Injectable()
export class Github {
  db = new  GithubDb();
  constructor(private http: Http) {}

  getOrg(org: string) {
    return this.makeRequest(`orgs/${org}`);
  }

  getReposForOrg(org: string) {
    return this.makeRequest(`orgs/${org}/repos`)
    .do(res => {
      console.log("Dexie cache");
      this.db.repos
        .bulkAdd(res)
        .then(() => {console.log("Dexie OK!")})
        .catch(err => console.error(err));
    });
  }

  getRepoForOrg(org: string, repo: string) {
    return this.makeRequest(`repos/${org}/${repo}`);
  }

  private makeRequest(path: string) {
    let params = new URLSearchParams();
    params.set('per_page', '100');

    let url = `https://api.github.com/${ path }`;
    return this.http.get(url, {search: params})
      .map((res) => res.json());
  }
}
