import { useState, useCallback, useEffect, useRef } from 'react';
import {
  CarouselDirection,
  CAROUSEL_AUTO_PLAY_DELAY,
  CAROUSEL_ANIMATION_DURATION,
  HomeHelpers
} from '../models/HomeModel';

interface UseCarouselParams {
  itemsCount: number;
  autoPlay?: boolean;
}

/**
 * Hook que gerencia toda a lógica do carrossel
 * 
 * Funcionalidades:
 * - Navegação (prev/next)
 * - Auto-play
 * - Animações
 * - Reset de timer ao clicar
 */
export const useCarousel = ({ itemsCount, autoPlay = true }: UseCarouselParams) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<CarouselDirection>('next');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Navega para um índice específico
   */
  const goToIndex = useCallback((index: number, dir: CarouselDirection) => {
    if (isAnimating || itemsCount === 0) return;

    setDirection(dir);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, CAROUSEL_ANIMATION_DURATION);
  }, [isAnimating, itemsCount]);

  /**
   * Vai para o próximo item
   */
  const goNext = useCallback(() => {
    const nextIndex = HomeHelpers.getNextIndex(currentIndex, itemsCount);
    goToIndex(nextIndex, 'next');
  }, [currentIndex, itemsCount, goToIndex]);

  /**
   * Vai para o item anterior
   */
  const goPrev = useCallback(() => {
    const prevIndex = HomeHelpers.getPrevIndex(currentIndex, itemsCount);
    goToIndex(prevIndex, 'prev');
  }, [currentIndex, itemsCount, goToIndex]);

  /**
   * Reseta o intervalo do auto-play
   */
  const resetAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (autoPlay && itemsCount > 1) {
      intervalRef.current = setInterval(goNext, CAROUSEL_AUTO_PLAY_DELAY);
    }
  }, [autoPlay, itemsCount, goNext]);

  /**
   * Configura auto-play
   */
  useEffect(() => {
    if (!autoPlay || itemsCount <= 1) return;

    intervalRef.current = setInterval(goNext, CAROUSEL_AUTO_PLAY_DELAY);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [goNext, itemsCount, autoPlay]);

  return {
    currentIndex,
    isAnimating,
    direction,
    goNext,
    goPrev,
    goToIndex,
    resetAutoPlay,
  };
};