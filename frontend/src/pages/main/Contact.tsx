import { useEffect } from 'react';
import { sendSupportEmailRequest } from '../../api/httpClient';

export const Contact = (props: { mapTitle: string | null }) => {
  // Google Maps removed - replaced with Demon Slayer themed content

  const sendSupportRequestEmailAction = () => {
    const formName = (document.getElementById('name') as HTMLInputElement)
      ?.value;
    const formEmail = (document.getElementById('email') as HTMLInputElement)
      ?.value;
    const formSubject = (document.getElementById('subject') as HTMLInputElement)
      ?.value;
    const formMessage =
      (document.getElementById('message') as HTMLInputElement)?.value || '';

    if (!(formName && formEmail && formSubject)) {
      return alert(
        'The email form is incomplete - Please fill out all required sections.'
      );
    }

    sendSupportEmailRequest(formName, formEmail, formSubject, formMessage);
  };

  return (
    <section id="contact" className="contact section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Contact the Demon Slayer Corps</h2>
          <p>
            Need help with a demon threat? Want to join the Demon Slayer Corps? Have questions about
            breathing techniques or training? Contact us through the form below or reach out directly
            to the Hashira. We're here to protect humanity and train the next generation of demon slayers.
          </p>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="info-box mb-4">
              <i className="bx bx-map" />
              <h3>Demon Slayer Corps Headquarters</h3>
              <p>
                Hidden Location in the Mountains<br />
                Wisteria Family Protected Area<br />
                Japan, Taisho Era
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="info-box mb-4">
              <i className="bx bx-envelope" />
              <h3>Contact Hashira</h3>
              <p>
                <strong>Flame Hashira:</strong> rengoku@demonslayers.local<br />
                <strong>Water Hashira:</strong> giyu@demonslayers.local<br />
                <strong>Insect Hashira:</strong> shinobu@demonslayers.local
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="info-box mb-4">
              <i className="bx bx-phone-call" />
              <h3>Emergency Hotline</h3>
              <p>
                <strong>Demon Threat:</strong> Report immediately<br />
                <strong>Training Inquiries:</strong> Available 24/7<br />
                <strong>General Support:</strong> hashira@demonslayers.local
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 ">
            <div className="demon-slayer-info-box mb-4 mb-lg-0" style={{ 
              height: 384, 
              background: 'linear-gradient(135deg, #1A1A1C 0%, #0B0B0C 100%)',
              border: '2px solid #87CEEB',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                textAlign: 'center', 
                zIndex: 2,
                position: 'relative'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚔️</div>
                <h3 style={{ color: '#87CEEB', marginBottom: '1rem', fontSize: '1.5rem' }}>
                  Demon Slayer Corps
                </h3>
                <p style={{ color: '#D1D1D3', fontSize: '1rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  Join the elite warriors protecting humanity from demons.
                </p>
                <div style={{ 
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(135, 206, 235, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid #87CEEB'
                }}>
                  <p style={{ color: '#87CEEB', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                    <strong>🏔️ Final Selection:</strong> Held twice yearly
                  </p>
                  <p style={{ color: '#87CEEB', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                    <strong>🗡️ Training:</strong> Master breathing techniques
                  </p>
                  <p style={{ color: '#87CEEB', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                    <strong>🛡️ Mission:</strong> Protect humanity from demons
                  </p>
                </div>
              </div>
              {/* Decorative background elements */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(135, 206, 235, 0.1) 0%, transparent 70%)',
                zIndex: 1
              }} />
            </div>
          </div>

          <div className="col-lg-6">
            <form role="form" className="php-email-form">
              <div className="form-row">
                <div className="col-md-6 form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Your Name (Demon Slayer Name)"
                    data-rule="minlen:4"
                    data-msg="Please enter at least 4 chars"
                  />
                  <div className="validate" />
                </div>
                <div className="col-md-6 form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Your Email (Corps Email)"
                    data-rule="email"
                    data-msg="Please enter a valid email"
                  />
                  <div className="validate" />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  id="subject"
                  placeholder="Subject (e.g., Demon Threat Report, Training Inquiry)"
                  data-rule="minlen:4"
                  data-msg="Please enter at least 8 chars of subject"
                />
                <div className="validate" />
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  name="message"
                  id="message"
                  rows={5}
                  data-rule="required"
                  data-msg="Please write something for us"
                  placeholder="Message (Describe your demon encounter, training request, or question for the Hashira...)"
                />
                <div className="validate" />
              </div>
              <div className="mb-3">
                <div className="loading">Sending to Hashira...</div>
                <div className="error-message" />
                <div className="sent-message">
                  Your message has been received by the Demon Slayer Corps. A Hashira will respond soon!
                </div>
              </div>
              <div className="text-center">
                <button
                  id="send-email-button"
                  onClick={() => sendSupportRequestEmailAction()}
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 100%)',
                    border: 'none',
                    color: '#0B0B0C',
                    fontWeight: 'bold',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(135, 206, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ⚔️ Send to Hashira
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
