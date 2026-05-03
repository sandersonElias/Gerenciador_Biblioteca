import { useState, useEffect } from 'react';
import { ANIMATED_WORDS, WORD_CHANGE_INTERVAL } from '../models/HomeModel';

/**
 * Hook que gerencia a animação de palavras rotativas
 * 
 * Retorna:
 * - currentWord: palavra atual sendo exibida
 * - isVisible: se a palavra está visível (para animação CSS)
 */
export const useAnimatedWords = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Esconde a palavra atual
      setIsVisible(false);

      // Após a animação de saída, troca a palavra e mostra novamente
      setTimeout(() => {
        setWordIndex((current) => (current + 1) % ANIMATED_WORDS.length);
        setIsVisible(true);
      }, 350); // Tempo da animação CSS
    }, WORD_CHANGE_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return {
    currentWord: ANIMATED_WORDS[wordIndex],
    isVisible,
  };
};