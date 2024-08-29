import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpLavavelService } from '../../../http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarPokemonesComponent implements OnInit {
  mostrarCrear: boolean = true; // Controlar la visibilidad del botón de crear
  mostrarEliminarEditar: boolean = false; // Controlar la visibilidad de los botones de eliminar y editar
  item: any; // Almacena el Pokemon actual
  nombreUsuario: string = ''; // Almacena el nombre del usuario que creo el Pokemon

  constructor(
    private router: Router, // Servicio para la navegación
    private servicio: HttpLavavelService // Servicio para realizar solicitudes
  ) {}

  ngOnInit() {
    // Suscribirse a los eventos de cambio de la ruta
    this.router.events.subscribe(() => {
      const url = this.router.url;

      // Muestra el botón de crear solo si la ruta no es '/createpokemones'
      this.mostrarCrear = url !== '/createpokemones';

      // Verifica si la ruta actual corresponde a ver o actualizar un Pokemon
      const ver = /^\/verpokemones\/(\d+)$/.exec(url);
      const editar = /^\/actualizarpokemones\/(\d+)$/.exec(url);
      if (ver) {
        this.mostrarEliminarEditar = true;
        this.obtenerPokemon(ver[1]); // Obtiene los detalles del Pokemon a partir del ID
        this.mostrarCrear = false;
      } else if (editar) {
        this.mostrarEliminarEditar = false;
        this.obtenerPokemon(editar[1]); // Obtiene los detalles del Pokemon a partir del ID
        this.mostrarCrear = false;
      } else {
        this.mostrarEliminarEditar = false;
      }
    });
  }

  // Obtiene los detalles del Pokemon desde el servidor
  obtenerPokemon(id: string) {
    this.servicio.Service_Get('pokemon', id).subscribe(
      (res: any) => {
        if (res.estatus) {
          this.item = res.data; // Almacenar el Pokemon obtenido
          this.obtenerNombreUsuario(this.item.id_user); // Obtener el nombre del usuario que creo el Pokemon
          console.log(this.item.id_user);
        } else {
          console.error('Error al obtener el Pokemon:', res.mensaje);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  // Obtener el nombre del usuario desde el servidor
  obtenerNombreUsuario(id_user: string) {
    this.servicio.Service_Get('usuario', id_user).subscribe(
      (res: any) => {
        if (res.estatus) {
          this.nombreUsuario = res.data.name; // Almacenar el nombre del usuario
        } else {
          console.error('Error al obtener el nombre del usuario:', res.mensaje);
        }
      },
      (error) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  // eliminar un Pokemon
  eliminarPokemon() {
    if (this.item) {
      Swal.fire({
        title: "¿Estás seguro de eliminar este Pokemon?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicio.Service_Delete('pokemon', this.item.id).subscribe(
            (res: any) => {
              if (res.estatus) {
                Swal.fire({
                  title: "¡Eliminado!",
                  text: "El Pokemon ha sido eliminado.",
                  icon: "success"
                });
                this.router.navigate(['/vistapokemones']); // Redirige a la página de vista de Pokemon
              } else {
                Swal.fire({
                  title: "Error",
                  text: res.mensaje,
                  icon: "error"
                });
              }
            },
            (error) => {
              console.error('Error en la solicitud:', error);
              Swal.fire({
                title: "Error",
                text: "Hubo un problema al eliminar el Pokemon.",
                icon: "error"
              });
            }
          );
        }
      });
    }
  }
}
