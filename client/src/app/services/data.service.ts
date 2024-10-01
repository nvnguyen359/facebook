import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private messageSource = new BehaviorSubject("message");
  currentMessage = this.messageSource.asObservable();
  constructor() {}
  async receiveMessage() {
    return new Promise((res, rej) => {
    setTimeout(() => {
      this.messageSource.asObservable().subscribe((data: any) => {
        res(data);
      });
    }, 500);
    });
  }
  sendMessage(message: any) {
    this.messageSource.next(message);
  }
}
