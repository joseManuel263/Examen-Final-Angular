import { Component } from '@angular/core';
import { HttpLavavelService } from '../../../http.service';
import Swal from 'sweetalert2';

// Interfaz para los eventos de paginación
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-vista-general',
  templateUrl: './vista-general.component.html',
  styleUrl: './vista-general.component.scss'
})
export class VistaGeneralPokemonesComponent {
  Datos: any = []; // Datos de los Pokemon que se mostraran en la vista
  page: number = 0; // Pagina actual de la paginación
  rows: number = 3; // Número de registros por pagina
  total: number = 0; // Número total de registros

  constructor(private servicio: HttpLavavelService) {
    this.obtenerData(); // Obtener datos al inicializar el componente
  }

  // Metodo para obtener los datos
  obtenerData() {
    this.servicio.Service_Get_Paginator('pokemon', '', this.page, this.rows).subscribe((res: any) => {
      if (res.estatus) {
        this.Datos = res.data; // Asignar datos recibidos
        this.total = res.total; // Asignar el total de registros
        this.Datos.forEach((dato: any, index: number) => {
          // Mandar llamar la funcion para obtener el nombre del usuario
          this.obtenerNombreUsuario(dato.id_user, index);
        });
      }
      console.log(res);
    });
  }

  // Metodo para obtener el nombre del usuario
  obtenerNombreUsuario(id_user: number, index: number) {
    this.servicio.Service_Get('usuario', id_user).subscribe((res: any) => {
      if (res.estatus) {
        // Asignar el nombre del usuario
        this.Datos[index].nombre_usuario = res.data.name;
      }
      console.log(res);
    });
  }

  // Metodo para eliminar un registro de Pokemon
  EliminarRegistro(id: number) {
    Swal.fire({
      title: "¿Estas seguro de eliminar?",
      text: "¡Esto ya no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar el Pokemon
        this.servicio.Service_Delete('pokemon', id).subscribe((res: any) => {
          if (res.estatus) {
            // Mostrar mensaje de Eliminado y actualizar los datos
            Swal.fire({
              title: "¡Eliminado!",
              text: res.messaje,
              icon: "success"
            });
            this.obtenerData();
          }
          console.log(res);
        });
      }
    });
  }

  // Metodo para manejar los cambios de pagina
  onPageChange(event: any) {
    console.log(event);
    this.page = event.page; // Actualizar la pagina actual
    this.rows = event.rows; // Actualizar el número de registros por pagina
    this.obtenerData(); // Obtener los datos para la nueva pagina
  }
}