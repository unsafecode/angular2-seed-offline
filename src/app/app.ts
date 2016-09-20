import {Component} from '@angular/core';

@Component({
  selector   : 'app',
  templateUrl: './app.html',
})
export class AppComponent {
  constructor(){
    require("offline-plugin/runtime").install();
    
  }
}
