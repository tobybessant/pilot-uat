import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {

  public email: string;
  public password: string;

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.email, this.password);
  }
}
