// src/pages/HomePage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useHomeViewModel } from '../../features/home/hooks/useHomeViewModel';
import { HeroSection } from '../../features/home/components/HeroSection';
import { BookCarousel } from '../../features/home/components/BookCarousel';
import { FeaturesSection } from '../../features/home/components/FeaturesSection';
import './HomePage.scss';

/**
 * HomePage (Orquestrador)
 * Conecta o ViewModel às Views
 * Apenas ~50 linhas de código!
 */
const HomePage: React.FC = () => {
  // Pega toda a lógica do ViewModel
  const viewModel = useHomeViewModel();

  return (
    <div className="home-page">
      {/* Hero com título animado e busca */}
      <HeroSection
        currentWord={viewModel.animatedWords.currentWord}
        isWordVisible={viewModel.animatedWords.isVisible}
        canManageLoans={viewModel.canManageLoans}
        onSearch={viewModel.handleSearch}
      />

      {/* Carrossel de livros populares */}
      <section className="popular-books">
        <div className="container">
          <div className="section-header">
            <h2>Livros Populares</h2>
            <Link to="/buscar" className="view-all">
              Ver todos →
            </Link>
          </div>

          <BookCarousel
            books={viewModel.popularBooks}
            currentBook={viewModel.currentBook}
            currentIndex={viewModel.carousel.currentIndex}
            isAnimating={viewModel.carousel.isAnimating}
            direction={viewModel.carousel.direction}
            onNext={viewModel.carousel.goNext}
            onPrev={viewModel.carousel.goPrev}
            onGoToIndex={viewModel.carousel.goToIndex}
            onResetAutoPlay={viewModel.carousel.resetAutoPlay}
          />
        </div>
      </section>

      {/* Features da biblioteca */}
      <FeaturesSection />
    </div>
  );
};

export default HomePage;