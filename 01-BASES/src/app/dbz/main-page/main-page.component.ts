import { Component } from '@angular/core';
import { Personaje } from '../intefaces/dbz.interface';



@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent{

  nuevo: Personaje ={
    nombre: '',
    poder: 0
  }

    constructor(){}

}
