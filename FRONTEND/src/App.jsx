import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import './index.css'
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';


function App() {
  return (
      // 1. Contenedor principal ahora es una columna vertical que ocupa toda la pantalla
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        
      </div>
  );
}

export default App
