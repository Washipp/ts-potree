import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export interface Config {
  url: string,
  port: number
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: Config;

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.config = {
      url: "http://127.0.0.1",
      port: 5000
    }
    this.baseUrl = this.createBaseUrl(this.config);
  }

  loadConfig() {
    return this.http
      .get<Config>('./assets/config.json')
      .subscribe(config => {
        console.log(config)
        this.config = config
      });
  }

  createBaseUrl(config: Config): string {
    return config.url + ':' + config.port;
  }

  getBaseUrl(): string {
    return this.baseUrl
  }
}
