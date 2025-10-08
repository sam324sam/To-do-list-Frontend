// libreria de angular
import { Routes } from '@angular/router';
// compoenetes de la aplicacion
import { Home } from './home/home';
import { FormRegister } from './form-register/form-register';
import { FormLogin } from './form-login/form-login';

// Para usar las rutas en la aplicacion
//  path: ruta de la aplicacion
//  component: componente que se va a cargar en esa ruta
export const routes: Routes = [
    {
        path: '', component: (Home)
    },
    {
        path: 'register', component: (FormRegister)
    },
    {
        path: 'login', component: (FormLogin)
    }
];
