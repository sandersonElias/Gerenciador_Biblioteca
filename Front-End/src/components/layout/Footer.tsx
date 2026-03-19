import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">📚 Biblioteca Monsa</span>
            <p className="footer-tagline">
              Um espaço dedicado à Leitura e ao Aprendizado.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h4>Navegação</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/buscar">Buscar Livros</a></li>
                <li><a href="/login">Login</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contato</h4>
              <ul>
                <li>contato@bibliotecamonsa.com</li>
                <li>(11) 1234-5678</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Biblioteca Monsa. Conectando alunos ao conhecimento.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  