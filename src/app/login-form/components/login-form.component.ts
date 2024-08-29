import { LocalstorageService } from './../../localstorage.service';
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpLavavelService } from "./../../http.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'animate.css';

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
    // Formulario de login
    LoginFormulario: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
    });

    constructor(
        private fb: FormBuilder,
        public service: HttpLavavelService,
        private router: Router,
        private localStorage: LocalstorageService
    ) {
        // Limpiar almacenamiento local
        this.localStorage.clean();
    }

    // Maneja el inicio de sesión
    onLoggedin() {
        // Verificar si es valido
        if (this.LoginFormulario.invalid) return;

        this.service.Service_Post('user', 'login', this.LoginFormulario.value).subscribe((data: any) => {
            console.log(data);

            if (data.estatus) {
                // Guardar token
                this.localStorage.setItem('accessToken', data.access_token);
                this.router.navigate(['/']);
            } else {
                // Mostrar si hay un error
                Swal.fire({
                    icon: "error",
                    title: 'Error de autenticación',
                    text: data.message || 'Error al iniciar sesión.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }, error => {
            // Mostrar si hay un error de conexión
            console.log(error);
            Swal.fire({
                icon: "error",
                title: 'Error de conexión',
                text: 'No se pudo conectar al servidor.',
                showConfirmButton: false,
                timer: 1500
            });
        });
    }

    // Verifica si un campo es inválido o tocado
    isValid(field: string): boolean {
        return !!(this.LoginFormulario.controls[field].errors && this.LoginFormulario.controls[field].touched);
    }

    // Get para los controles del formulario
    get f() { return this.LoginFormulario.controls; }

    // Maneja la acción de guardar (resetear formulario)
    Guardar() {
        if (this.LoginFormulario.invalid) {
            // Marcar todos los campos como tocados
            this.LoginFormulario.markAllAsTouched();
            return;
        }
        console.log(this.LoginFormulario.value);
        // Resetear formulario
        this.LoginFormulario.reset({ email: '', password: '' });
    }
}
