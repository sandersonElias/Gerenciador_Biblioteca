import React from 'react';

interface BookCoverProps {
  imageUrl?: string;
  title: string;
}

export const BookCover: React.FC<BookCoverProps> = ({ imageUrl, title }) => {
  return (
    <div className="book-cover-large">
      {imageUrl ? (
        <img src={imageUrl} alt={title} />
      ) : (
        <div className="cover-placeholder">
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};