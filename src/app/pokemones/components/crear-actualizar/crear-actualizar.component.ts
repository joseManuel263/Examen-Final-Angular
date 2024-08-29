import { HttpLavavelService } from './../../../http.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-actualizar',
  templateUrl: './crear-actualizar.component.html',
  styleUrls: ['./crear-actualizar.component.scss']
})
export class CrearActualizarPokemonesComponent {

  // Lista de tipos de Pokemones
  tipos: { label: string, value: string }[] = [
    { label: 'Bicho', value: 'Bicho' },
    { label: 'Dragón', value: 'Dragón' },
    { label: 'Eléctrico', value: 'Eléctrico' },
    { label: 'Hada', value: 'Hada' },
    { label: 'Lucha', value: 'Lucha' },
    { label: 'Fuego', value: 'Fuego' },
    { label: 'Volador', value: 'Volador' },
    { label: 'Planta', value: 'Planta' },
    { label: 'Tierra', value: 'Tierra' },
    { label: 'Fantasma', value: 'Fantasma' },
    { label: 'Hielo', value: 'Hielo' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Veneno', value: 'Veneno' },
    { label: 'Psíquico', value: 'Psíquico' },
    { label: 'Roca', value: 'Roca' },
    { label: 'Agua', value: 'Agua' }
  ];

  // Formulario para crear o actualizar
  public CrearActualizarFormulario: FormGroup;
  ID: number | undefined = undefined;

  constructor(
    private fb: FormBuilder, // Servicio de FormBuilder para construir el formulario
    public servicio: HttpLavavelService, // Servicio para manejar peticiones
    private activatedRoute: ActivatedRoute // Servicio para obtener parámetros de la ruta
  ) {
    // Inicialización del formulario y sus validaciones
    this.CrearActualizarFormulario = this.fb.group({
      nombre: ['', [Validators.required]], // Campo nombre validación: requerido
      tipo: ['', [Validators.required]], // Campo tipo validación: requerido
      url_imagen: ['', [Validators.required]], // Campo URL para imagen validación: requerido
      hp: ['', [Validators.required, Validators.min(1), Validators.max(999)]], // Campo HP validación: requerido con validación para valor mínimo y máximo
      defensa: ['', [Validators.required, Validators.min(1), Validators.max(100)]], // Campo defensa validación: requerido con validación para valor mínimo y máximo
      ataque: ['', [Validators.required, Validators.min(1), Validators.max(100)]], // Campo ataque validación: requerido con validación para valor mínimo y máximo
      rapidez: ['', [Validators.required, Validators.min(1), Validators.max(100)]], // Campo rapidez validación: requerido con validación para valor mínimo y máximo
    });

    // Obtener el ID de los parámetros y cargar los datos si es que existen
    this.activatedRoute.params.subscribe(params => {
      const idParam = params['id'];
      if (idParam) {
        this.ID = +idParam;
        this.obtenerData();
      }
    });

    // Establecer límites para los valores de los campos defensa, ataque y rapidez
    ['defensa', 'ataque', 'rapidez'].forEach(field => {
      this.CrearActualizarFormulario.get(field)?.valueChanges.subscribe(value => {
        if (value > 999) {
          this.CrearActualizarFormulario.get(field)?.setValue(100, { emitEvent: false });
        }
        if (value < 1) {
          this.CrearActualizarFormulario.get(field)?.setValue(1, { emitEvent: false });
        }
      });
    });

    // Establecer límite en el campo de HP
    ['hp'].forEach(field => {
      this.CrearActualizarFormulario.get(field)?.valueChanges.subscribe(value => {
        if (value > 999) {
          this.CrearActualizarFormulario.get(field)?.setValue(999, { emitEvent: false });
        }
        if (value < 1) {
          this.CrearActualizarFormulario.get(field)?.setValue(1, { emitEvent: false });
        }
      });
    });
  }

  // Obtener los datos de un Pokémon por su ID para actualizar
  obtenerData() {
    if (this.ID) {
      this.servicio.Service_Get('pokemon', this.ID).subscribe((res: any) => {
        if (res.estatus) {
          // Si la respuesta es exitosa, se actualiza el formulario
          this.CrearActualizarFormulario.patchValue(res.data);
        } else {
          // Mostrar un mensaje de error
          Swal.fire({
            icon: "error",
            title: res.message,
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }

  // Verifica si un campo del formulario es válido o ha sido tocado
  isValid(field: string): boolean {
    return !!(this.CrearActualizarFormulario.controls[field].errors && this.CrearActualizarFormulario.controls[field].touched);
  }

  // Obtener controles del formulario
  get f() { return this.CrearActualizarFormulario.controls; }

  // Método para guardar o actualizar el Pokémon
  Guardar() {
    if (this.CrearActualizarFormulario.invalid) {
      // Marca todos los campos como tocados para mostrar errores
      this.CrearActualizarFormulario.markAllAsTouched();
      return;
    }

    // Ajustar valores a un máximo permitido en el formulario
    ['hp', 'defensa', 'ataque', 'rapidez'].forEach(field => {
      let value = this.CrearActualizarFormulario.get(field)?.value;
      if (value > 999) {
        this.CrearActualizarFormulario.get(field)?.setValue(100);
      }
    });

    // Crear o actualizar el Pokemon dependiendo de si hay un ID
    if (this.ID == null) {
      // Crear nuevo Pokemon
      this.servicio.Service_Post('pokemon', '', this.CrearActualizarFormulario.value).subscribe((res: any) => {
        if (res.estatus) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "<strong>Éxito!</strong>",
            html: "Pokémon guardado",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'custom-alert-popup',
              title: 'custom-alert-title',
              icon: 'custom-alert-icon',
            },
            background: '#e7f9ee',
            backdrop: false,
            toast: true,
          });
          // Limpiar formulario de guardar
          this.CrearActualizarFormulario.reset();
        } else {
          this.mostrarErrores(res.mensaje);
        }
      });
    } else {
      // Actualizar Pokemones existentes
      this.servicio.Service_Patch('pokemon', this.ID, this.CrearActualizarFormulario.value).subscribe((res: any) => {
        if (res.estatus) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "<strong>Éxito!</strong>",
            html: "Pokémon actualizado",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'custom-alert-popup',
              title: 'custom-alert-title',
              icon: 'custom-alert-icon',
            },
            background: '#e7f9ee',
            backdrop: false,
            toast: true,
          });
          // Limpiar formulario de guardar
          this.CrearActualizarFormulario.reset();
        } else {
          this.mostrarErrores(res.mensaje);
        }
      });
    }
  }

  // Método para mostrar mensajes de error
  mostrarErrores(mensaje: any) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "<strong>Problema al guardar</strong>",
      html: mensaje,
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'custom-alert-popup',
        title: 'custom-alert-title',
        icon: 'custom-alert-icon',
      },
      background: '#d21e48',
      backdrop: false,
      toast: true,
    });
  }
}
