import { Component, OnInit } from '@angular/core';
import { HttpLavavelService } from '../../../http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss'] // Estilo para el componente
})
export class VistaPokemonesComponent implements OnInit {
  ID: number = 0; // ID del Pokémon, se inicializa en 0
  Datos: any; // Variable para almacenar los datos del Pokémon

  constructor(
    private servicio: HttpLavavelService, // Servicio para las solicitudes HTTP
    private activetedRoute: ActivatedRoute // Servicio para acceder a los parámetros de la ruta
  ) {}

  ngOnInit(): void {
    // Método que se llama al inicializar el componente
    this.activetedRoute.params.subscribe(params => {
      console.log(params);
      this.ID = params['id']; // Asignar el ID del Pokémon
      this.obtenerData(); // Llamada al método para obtener los datos
    });
  }

  obtenerData(): void {
    // Método para obtener los datos del Pokémon
    this.servicio.Service_Get('pokemon', this.ID).subscribe(
      (res: any) => {
        // Manejo de la respuesta
        console.log("res:", res);
        if (res.estatus) {
          // Verificar si la respuesta es exitosa
          this.Datos = res.data; // Asignar los datos del Pokémon
        } else {
          // Manejo de errores si la respuesta no es exitosa
          console.error("Error en la respuesta:", res.mensaje); // Log del mensaje de error
        }
      },
      (error: any) => {
        // Manejo de errores en la solicitud
        console.error("Error en la solicitud:", error); // Log del error de solicitud
      }
    );
  }
}
