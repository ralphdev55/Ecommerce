// src/pages/LoginPage.jsx o src/components/LoginPage.jsx
import React from 'react';
import LoginForm from './LoginForm.jsx'; // Ajusta la ruta si es necesario
import RegisterPrompt from './RegisterPrompt.jsx'; // Ajusta la ruta si es necesario

function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <LoginForm />
        <RegisterPrompt />
      </div>
    </div>
  );
}

export default LoginPage;