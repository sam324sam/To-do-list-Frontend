// libreria de angular
import { Routes } from '@angular/router';
// compoenetes de la aplicacion
import { Home } from './components/home/home';
import { FormRegister } from './components/form-register/form-register';
import { FormLogin } from './components/form-login/form-login';
import { AllList } from './components/all-list/all-list';
import { DetalList } from './components/detal-list/detal-list';
import { ErrorPage } from './components/error-page/error-page';
// auth guard
import { AuthGuard } from './guards/auth-guard';

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
    },
    
    {
        // Rutas protegida con el AuthGuard
        path: 'all-list', component: (AllList), canActivate: [AuthGuard]
    },
    {
        path: 'detal-list', component: (DetalList), canActivate: [AuthGuard]
    },
    // La ruta de error debe ir al final por que la primera que ve angiular es la que carga :c
    {
        path: '**', component:  (ErrorPage)
    },
];
