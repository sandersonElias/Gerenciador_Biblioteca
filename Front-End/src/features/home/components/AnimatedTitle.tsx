import React from 'react';

interface AnimatedTitleProps {
  currentWord: string;
  isVisible: boolean;
}

/**
 * Componente puro que renderiza o título com palavra animada
 * Recebe tudo via props, zero lógica interna
 */
export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ 
  currentWord, 
  isVisible 
}) => {
  return (
    <h1 className="hero-title">
      Um espaço para
      <span 
        className={`hero-word ${isVisible ? 'hero-word--visible' : 'hero-word--hidden'}`}
      >
        {currentWord}
      </span>
    </h1>
  );
};