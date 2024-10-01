import { Component } from "@angular/core";
import { BaseApiUrl, links } from "src/app/general";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-menu-left",
  templateUrl: "./menu-left.component.html",
  styleUrls: ["./menu-left.component.scss"],
})
export class MenuLeftComponent {
  ver: string = '';
  info: any = "";
  links = links();
  constructor(private service: ApiService) {
  // this.getApi()
  }
  getApi(){
    this.service.eventWindow("ver").then((e: any) => {
      this.ver = `${e.data}`.split(":")[1];
      this.info = e.data;
      localStorage.setItem('ver',this.ver);
      const mes = document.getElementById("message");
      if (mes) mes.innerHTML = this.info;
    });
  }
  ngOnInit() {
    this.getApi()
  }
}
