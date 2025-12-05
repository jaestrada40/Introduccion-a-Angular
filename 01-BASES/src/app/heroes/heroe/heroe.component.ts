import { Component } from "@angular/core";



@Component({
    selector: 'app-heroe',
    templateUrl: './heroe.component.html',
    standalone: false
})




export class HeroeComponent{

    nombre: string = 'Ironman';
    edad  : number = 45;

    get nombreCapitaliado(): string {
        return this.nombre.toUpperCase();
    }


    obtenerNombre(): string {

        return `${ this.nombre}  - ${ this.edad }`;
    }

    cambiarNombre():void {
        this.nombre = 'Spiderman';
    }

    cambiarEdad():void {
        this.edad = 53;
    }

}