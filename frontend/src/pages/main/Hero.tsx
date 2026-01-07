import type { FC } from 'react';

export const Hero: FC = () => {
  return (
    <>
      <section id="hero" className="d-flex align-items-center">
        <div className="container-fluid" data-aos="fade-up">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 pt-3 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1>Demon Slayer: Kimetsu no Yaiba</h1>
              <h2>Join the Demon Slayer Corps and protect humanity from demons!</h2>
              <p>
                Follow the journey of Tanjiro Kamado as he becomes a demon slayer to save his sister Nezuko. 
                Master the breathing techniques, meet the Hashira, and face powerful demons in this epic adventure.
              </p>
              <div>
                <a
                  href="/shop"
                  className="btn-get-started scrollto"
                >
                  Visit the Shop
                </a>
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 order-1 order-lg-2 hero-img"
              data-aos="zoom-in"
              data-aos-delay="150"
            >
              <img
                src="assets/img/hero-img.png"
                className="img-fluid animated"
                alt="Demon Slayer"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Demon Slayer Images Section */}
      <section id="demon-slayer-gallery" className="demon-slayer-gallery section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Demon Slayer Gallery</h2>
            <p>Explore the world of Kimetsu no Yaiba through stunning artwork</p>
          </div>
          <div className="row gallery-container">
            {['assets/img/demon-slayer-1.jpg', 'assets/img/demon-slayer-2.jpg', 'assets/img/demon-slayer-3.jpg', 'assets/img/demon-slayer-4.jpg', 'assets/img/demon-slayer-5.jpg', 'assets/img/demon-slayer-6.jpg', 'assets/img/demon-slayer-7.jpg', 'assets/img/demon-slayer-8.jpg'].map((imagePath, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 gallery-item">
                <img
                  src={imagePath}
                  className="img-fluid"
                  alt={`Demon Slayer Gallery Image ${index + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
