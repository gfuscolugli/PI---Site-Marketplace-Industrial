import { createBrowserRouter } from 'react-router-dom';

// 1. TODOS OS IMPORTS FICAM AQUI NO TOPO
import { HomeLayout } from './layouts/HomeLayout';
import { PrivateLayout } from './layouts/PrivateLayout';

import Home from './pages/public/Home';
import { Login } from './pages/public/Login';
import { Cadastro } from './pages/public/Cadastro';
import { Dashboard } from './pages/private/Dashboard'; 
import { Marketplace } from './pages/private/Marketplace';
import { MeusResiduos } from './pages/private/MeusResiduos';
import { Transacoes } from './pages/private/Transacoes';


const router = createBrowserRouter([

  {
    element: <HomeLayout />, 
    children: [{ path: "/", element: <Home /> }]
  },
  
  { path: "/login", element: <Login /> },
  { path: "/cadastro", element: <Cadastro /> },
  
  {
    element: <PrivateLayout />,
    children: [
      { 
        path: "/dashboard", 
        element: <Dashboard /> 
      },
      { 
        path: "/marketplace", 
        element: <Marketplace /> 
      },
      { 
        path: "/meus-residuos", 
        element: <MeusResiduos /> 
      },
      { 
        path: "/transacoes", 
        element: <Transacoes />
      }
    ]
  }
]);

export { router };