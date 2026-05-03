// craco.config.js

const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/context': path.resolve(__dirname, 'src/context'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/assets': path.resolve(__dirname, 'src/components/assets'), // ✅ ADICIONE
    },
  },
};