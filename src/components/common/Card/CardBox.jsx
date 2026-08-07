import React from 'react';
import './CardBox.css';

/**
 * Standardized Academic Card Component (CardBox)
 * Adheres to 4px border radius, 24px internal padding, and dual-theme tokens.
 */
export const CardBox = ({
  children,
  className = '',
  hoverable = true,
  onClick = null,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`card-box ${hoverable ? 'card-box-hoverable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export default CardBox;
