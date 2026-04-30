import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TrocarSenhaBanner from '../auth/Trocarsenhabanner';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <TrocarSenhaBanner />
      <main className="main-content" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;