import React from 'react';
import './Skeleton.css';

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={{
        width: width || (variant === 'circle' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '1rem' : variant === 'circle' ? '40px' : '120px'),
        ...style
      }}
      aria-hidden="true"
    />
  );
};

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-header">
      <Skeleton variant="rect" width="100px" height="24px" />
      <Skeleton variant="rect" width="80px" height="24px" />
    </div>
    <Skeleton variant="text" width="90%" height="22px" style={{ margin: '12px 0 8px' }} />
    <Skeleton variant="text" width="60%" height="16px" style={{ marginBottom: '14px' }} />
    <Skeleton variant="text" width="100%" height="14px" />
    <Skeleton variant="text" width="95%" height="14px" />
    <Skeleton variant="text" width="80%" height="14px" style={{ marginBottom: '16px' }} />
    <div className="skeleton-card-footer">
      <Skeleton variant="rect" width="120px" height="32px" />
      <Skeleton variant="rect" width="100px" height="32px" />
    </div>
  </div>
);

export const SkeletonPaperList = ({ count = 3 }) => (
  <div className="skeleton-paper-list">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Skeleton;
