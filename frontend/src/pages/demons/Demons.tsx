import type { FC } from 'react';
import Header from '../main/Header/Header';
import Footer from '../main/Footer';
import { demonImages, extractNameFromFilename } from '../../utils/imageLoader';

export const Demons: FC = () => {
  return (
    <>
      <Header onInnerPage={true} />
      <main id="main" style={{ paddingTop: '80px' }}>
        <section className="services">
          <div className="container">
            <div className="section-title">
              <h2>Demon Threats</h2>
              <p>
                Demons are supernatural creatures that pose grave threats to humanity. Understanding their
                abilities, weaknesses, and classification is essential for effective defense strategies.
              </p>
            </div>

            {/* 4 Individual Image Cards - 2x2 Grid Layout */}
            <div className="row">
              {demonImages.map((imagePath, index) => {
                const name = extractNameFromFilename(imagePath);
                return (
                  <div key={index} className="col-lg-6 col-md-6 d-flex align-items-stretch">
                    <div className="icon-box">
                      <div className="icon" style={{ marginBottom: '20px', width: '100%', height: 'auto', maxHeight: '500px', position: 'relative' }}>
                        <img
                          src={imagePath}
                          alt={name}
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '500px',
                            minHeight: '350px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div style="width: 100%; height: 350px; background: #1A1A1C; border: 1px solid #D1D1D3; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                                <span style="color: #D1D1D3;">Image: ${name}</span>
                              </div>`;
                            }
                          }}
                        />
                      </div>
                      <h4 style={{ marginTop: '20px', fontSize: '22px' }}>
                        <a href="#demon">{name}</a>
                      </h4>
                      <h5 style={{ color: '#87CEEB', marginBottom: '10px', fontSize: '18px' }}>
                        Demon Threat
                      </h5>
                      <p style={{ fontSize: '16px' }}>A powerful demon that poses a grave threat to humanity. Only the strongest demon slayers can hope to defeat such creatures.</p>
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

export default Demons;

