import type { FC } from 'react';
import { useEffect } from 'react';
import Header from '../main/Header/Header';
import Footer from '../main/Footer';
import { characterImages, getCharacterInfo } from '../../utils/imageLoader';

export const Characters: FC = () => {
  useEffect(() => {
    console.log('Character images array:', characterImages);
    console.log('Number of character images:', characterImages.length);
  }, []);

  // Function to check if an image should be displayed large
  const isLargeImage = (imagePath: string): boolean => {
    const largeImages = [
      'tanjiro-kamado-angry',
      'zenetsu-asthetic',
      'zenitsu-agatsuma-swag',
      'tanjiro-and-nezuko'
    ];
    return largeImages.some(largeImg => imagePath.includes(largeImg));
  };

  // Separate large and small images
  const largeImages = characterImages.filter(img => isLargeImage(img));
  const smallImages = characterImages.filter(img => !isLargeImage(img));

  // Render image card component
  const renderImageCard = (imagePath: string, index: number, isLarge: boolean) => {
    const characterInfo = getCharacterInfo(imagePath);
    
    return (
      <div 
        key={`${imagePath}-${index}`}
        className="d-flex align-items-stretch"
        style={isLarge ? { 
          width: '70%',
          marginLeft: 'auto',
          marginRight: 'auto'
        } : {
          width: '50%',
          paddingLeft: '7.5px',
          paddingRight: '7.5px'
        }}
      >
        <div className="icon-box" style={{ width: '100%' }}>
          <div 
            className="icon" 
            style={{ 
              marginBottom: '20px', 
              width: '100%', 
              height: 'auto', 
              maxHeight: isLarge ? '700px' : '300px',
              minHeight: isLarge ? '400px' : '200px',
              position: 'relative' 
            }}
          >
            <img
              src={imagePath}
              alt={characterInfo.name}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: isLarge ? '700px' : '300px',
                minHeight: isLarge ? '400px' : '200px',
                borderRadius: '8px',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                console.error('Image failed to load:', imagePath);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<div style="width: 100%; height: ${isLarge ? '400px' : '200px'}; background: #1A1A1C; border: 1px solid #D1D1D3; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                    <span style="color: #D1D1D3;">Image: ${characterInfo.name}</span>
                  </div>`;
                }
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', imagePath);
              }}
            />
          </div>
          <h4 style={{ marginTop: '20px' }}>
            <a href="#character">{characterInfo.name}</a>
          </h4>
          <h5 style={{ color: '#87CEEB', marginBottom: '10px' }}>
            {characterInfo.title}
          </h5>
          {characterInfo.breathingTechnique && (
            <p style={{ color: '#B0B0B0', fontSize: '13px', marginBottom: '10px', fontStyle: 'italic' }}>
              Breathing: {characterInfo.breathingTechnique}
            </p>
          )}
          <p>{characterInfo.description}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header onInnerPage={true} />
      <main id="main" style={{ paddingTop: '80px' }}>
        <section className="services">
          <div className="container">
            <div className="section-title">
              <h2>Tanjiro & Friends</h2>
              <p>
                The core group of demon slayers who work together to protect humanity. Each member brings
                unique skills, personalities, and strengths to their shared mission.
              </p>
            </div>

            <div>
              {largeImages.map((largeImage, largeIndex) => {
                const smallPair = smallImages.slice(largeIndex * 2, largeIndex * 2 + 2);
                
                return (
                  <div key={`group-${largeIndex}`}>
                    {/* Row 1: 2 small images side by side (50% each) */}
                    {smallPair.length > 0 && (
                      <div className="row" style={{ marginBottom: '30px', display: 'flex', alignItems: 'stretch' }}>
                        {smallPair.map((smallImage, smallIndex) => 
                          renderImageCard(smallImage, largeIndex * 2 + smallIndex, false)
                        )}
                      </div>
                    )}
                    
                    {/* Row 2: 1 large image below (70% centered) */}
                    <div className="row" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                      {renderImageCard(largeImage, largeIndex, true)}
                    </div>
                  </div>
                );
              })}
              
              {/* Render remaining small images if any */}
              {smallImages.slice(largeImages.length * 2).length > 0 && (
                <div className="row" style={{ marginBottom: '30px', display: 'flex', alignItems: 'stretch' }}>
                  {smallImages.slice(largeImages.length * 2).map((smallImage, index) => 
                    renderImageCard(smallImage, largeImages.length * 2 + index, false)
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Characters;

