import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoaderService {
  private loading: boolean = false;
  constructor() {}
  public set isLoading(v: boolean) {
    this.loading = v;
  }
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  public get isLoading() {
    return this.loading;
  }
  getLoading(): boolean {
    return this.loading;
  }
}
