import type { FC } from 'react';
import Header from '../main/Header/Header';
import Footer from '../main/Footer';
import { hashiraImages, extractNameFromFilename } from '../../utils/imageLoader';

export const Hashiras: FC = () => {
  return (
    <>
      <Header onInnerPage={true} />
      <main id="main" style={{ paddingTop: '80px' }}>
        <section className="services">
          <div className="container">
            <div className="section-title">
              <h2>The Hashira</h2>
              <p>
                The Hashira are the most elite demon slayers, each mastering a unique breathing technique
                and serving as pillars of strength in the fight against darkness.
              </p>
            </div>

            <div className="row">
              {hashiraImages.map((imagePath, index) => {
                const name = extractNameFromFilename(imagePath);
                return (
                  <div key={index} className="col-lg-4 col-md-6 d-flex align-items-stretch">
                    <div className="icon-box">
                      <div className="icon" style={{ marginBottom: '20px', width: '100%', height: 'auto', maxHeight: '300px', position: 'relative' }}>
                        <img
                          src={imagePath}
                          alt={name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '300px',
                            minHeight: '200px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div style="width: 100%; height: 200px; background: #1A1A1C; border: 1px solid #D1D1D3; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                                <span style="color: #D1D1D3;">Image: ${name}</span>
                              </div>`;
                            }
                          }}
                        />
                      </div>
                      <h4 style={{ marginTop: '20px' }}>
                        <a href="#hashira">{name}</a>
                      </h4>
                      <h5 style={{ color: '#87CEEB', marginBottom: '10px' }}>
                        Hashira
                      </h5>
                      <p>One of the elite demon slayers who serve as pillars of strength in the Demon Slayer Corps.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Hashiras;

