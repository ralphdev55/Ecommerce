import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'

import App from './App.jsx'

import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import Miscompras from './pages/Miscompras.jsx';
import PerfilDeUsuario from './pages/PerfilDeUsuario.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import MyProducts from './pages/MyProducts.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/Register",
    element: <RegisterPage />
  },
  {
    path: "/App",
    element: <App />,
    children: [
      {
        index: true, // Esto hace que Home sea la ruta por defecto para /App
        element: <HomePage />
      },
      {
        path: "miscompras",
        element: <Miscompras />,
      },
      {
        path:"Perfil",
        element: <PerfilDeUsuario />,
      },
      {
        path: "products",
        element: <ProductosPage />,
      },
      {
        // This is the dynamic route
        // ':productId' is a placeholder for the actual ID
        path: "products/:productId", 
        element: <ProductDetailPage />,
      },
      {
        path: "my-products",
        element: <MyProducts />,
      },
      // Puedes añadir más rutas hijas aquí, ej:
      // { path: "profile", element: <Profile /> } -> se vería en /App/profile
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);