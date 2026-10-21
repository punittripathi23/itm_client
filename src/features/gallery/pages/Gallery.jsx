import React, { useState, useEffect } from 'react';
import { galleryService } from '../../../services/gallery.service';
import Modal from '../../../components/common/Modal/Modal';
import { Image, Video, Camera, Play, Eye } from 'lucide-react';
import './Gallery.css';

export const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Lightbox view for single image
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    setAlbums(galleryService.getAlbums());
  }, []);

  const handleOpenAlbum = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  return (
    <div className="gallery-root container animate-fade-in">
      <div className="gallery-page-header">
        <h1>Event Media Gallery</h1>
        <p>Browse photo albums and video highlights from ITM-JET academic events.</p>
      </div>

      <div className="albums-grid grid-3">
        {albums.map(album => (
          <div key={album.id} className="album-card glass glass-hover" onClick={() => handleOpenAlbum(album)}>
            <div className="album-cover-wrapper">
              <img src={album.coverImage} alt={album.title} className="album-cover-img" />
              <div className="album-overlay flex-center">
                <div className="play-circle">
                  {album.type === 'video' ? <Play size={20} fill="currentColor" /> : <Eye size={20} />}
                </div>
              </div>
              <span className={`badge album-badge ${album.type === 'video' ? 'badge-danger' : 'badge-success'}`}>
                {album.type === 'video' ? <Video size={12} className="mr-1" /> : <Camera size={12} className="mr-1" />}
                {album.type === 'video' ? 'Video Logs' : 'Photo Album'}
              </span>
            </div>

            <div className="album-info">
              <h3 className="album-title">{album.title}</h3>
              <p className="album-count">{album.items?.length || 0} media clips</p>
            </div>
          </div>
        ))}
      </div>

      {/* Album Items Modal */}
      {selectedAlbum && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedAlbum.title}
          size="large"
        >
          <div className="album-items-modal">
            {selectedAlbum.type === 'video' ? (
              <div className="video-items-grid grid-2">
                {selectedAlbum.items.map((item) => (
                  <div key={item.id} className="video-item-card glass">
                    <div className="video-player-wrapper">
                      <video controls src={item.url} poster={selectedAlbum.coverImage} className="video-tag"></video>
                    </div>
                    <div className="video-caption">
                      <p>{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="photo-items-grid grid-3">
                {selectedAlbum.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="photo-item-card"
                    onClick={() => setLightboxImg(item)}
                  >
                    <img src={item.url} alt={item.caption} className="photo-img" />
                    <div className="photo-caption-hover">
                      <p>{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="lightbox-overlay animate-fade-in" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImg.url} alt={lightboxImg.caption} className="lightbox-img animate-scale-up" />
            <p className="lightbox-caption">{lightboxImg.caption}</p>
            <button className="lightbox-close" onClick={() => setLightboxImg(null)}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
