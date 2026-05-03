import React from 'react';
import LoginImg from '@/components/assets/login-img.png';

/**
 * Componente puro da ilustração do login
 * Apenas apresentação visual
 */
export const LoginIllustration: React.FC = () => {
  return (
    <div className="login-illustration">
      <div className="illustration-content">
        <img className="illustration-icon" src={LoginImg} alt="Ilustração biblioteca" />
        <h2>Biblioteca Monsa</h2>
        <p>Conectando alunos ao conhecimento</p>
      </div>
    </div>
  );
};