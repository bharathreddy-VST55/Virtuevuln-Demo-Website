import { FC, FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../api/ApiUrl';
import Header from '../main/Header/Header';

interface UploadResponse {
  success: boolean;
  message: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  warning?: string;
  error?: string;
}

export const Upload: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Debug: Log component mount
  useEffect(() => {
    console.log('Upload component mounted and rendering');
    console.log('Current pathname:', window.location.pathname);
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<UploadResponse>(
        `${ApiUrl.App}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Upload failed');
      setResult({
        success: false,
        message: 'Upload failed',
        error: err.response?.data?.error || err.message
      });
    } finally {
      setUploading(false);
    }
  };

  // Test: Render simple content first to verify route works
  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0B0B0C', 
        color: '#E0E0E0', 
        padding: '50px',
        fontSize: '24px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#87CEEB' }}>Loading Upload Page...</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0C', color: '#E0E0E0', width: '100%', position: 'relative', zIndex: 1 }}>
      <Header onInnerPage={true} />
      <main id="main" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)', background: '#0B0B0C', color: '#E0E0E0', width: '100%', position: 'relative' }}>
        <section className="services" style={{ padding: '40px 0', minHeight: '500px', width: '100%', display: 'block' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px', width: '100%', display: 'block' }}>
            <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px', padding: '20px 0', width: '100%', display: 'block' }}>
              <h2 style={{ color: '#87CEEB', marginBottom: '10px', fontSize: '36px', fontWeight: 'bold', display: 'block', visibility: 'visible' }}>Demon Slayer Corps - Mission Report</h2>
              <p style={{ color: '#E0E0E0', fontSize: '16px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                Upload evidence of demon elimination: photos of defeated demons or mission reports. This information is critical for tracking demon activity and improving our combat strategies.
              </p>
            </div>

            <div style={{ 
              maxWidth: '900px', 
              margin: '40px auto',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '40px',
              borderRadius: '10px',
              border: '1px solid #333',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: '#87CEEB', 
                marginBottom: '20px',
                fontSize: '24px',
                borderBottom: '2px solid #333',
                paddingBottom: '10px'
              }}>
                Upload File
              </h3>
        
              {/* Demon Killing Precautions */}
              <div style={{
                background: 'linear-gradient(135deg, #8B0000 0%, #4B0000 100%)',
                border: '2px solid #FF4444',
                padding: '25px',
                borderRadius: '8px',
                marginBottom: '30px',
                color: '#FFE5E5',
                boxShadow: '0 4px 6px rgba(255, 68, 68, 0.3)'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  marginTop: 0, 
                  marginBottom: '15px',
                  color: '#FF6B6B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '28px' }}>⚔️</span>
                  Critical Precautions for Demon Elimination
                </h3>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '25px',
                  fontSize: '14px',
                  lineHeight: '2',
                  listStyleType: 'disc'
                }}>
                  <li><strong>Always use Nichirin Blade:</strong> Only weapons forged from Scarlet Crimson Iron Sand and Scarlet Crimson Ore can permanently kill demons.</li>
                  <li><strong>Target the Neck:</strong> Complete decapitation is required. Partial cuts will not eliminate the demon.</li>
                  <li><strong>Sunlight Exposure:</strong> If decapitation fails, expose the demon to direct sunlight - it will disintegrate instantly.</li>
                  <li><strong>Wisteria Protection:</strong> Carry wisteria flowers or extract as a deterrent. Demons are repelled by wisteria.</li>
                  <li><strong>Report Immediately:</strong> After elimination, upload evidence within 24 hours for proper documentation.</li>
                  <li><strong>Never Engage Alone:</strong> Always work in teams when facing Upper Moon demons or unknown threats.</li>
                  <li><strong>Check for Survivors:</strong> Ensure no humans are nearby who could be turned into demons.</li>
                </ul>
              </div>

              {/* Security Warning (Hidden but still in code) */}
              <div style={{
                background: '#F4433620',
                border: '1px solid #F44336',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '30px',
                color: '#ffcccb',
                fontSize: '12px',
                opacity: 0.7
              }}>
                <strong>⚠️ Technical Note:</strong> This upload endpoint is intentionally vulnerable for security training. Files are stored in isolated temp folder and auto-deleted after 5 seconds. No files are executed.
              </div>

              <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    color: '#E0E0E0',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    Upload Demon Evidence (Photo or Report):
                  </label>
                  
                  {/* Visible File Input Button */}
                  <div style={{ marginBottom: '15px' }}>
                    <label
                      htmlFor="file-input"
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
                        color: '#0B0B0C',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(135, 206, 235, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(135, 206, 235, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(135, 206, 235, 0.3)';
                      }}
                    >
                      📸 Upload Demon Evidence
                    </label>
                    <input
                      id="file-input"
                      type="file"
                      onChange={handleFileChange}
                      accept="*/*"
                      style={{
                        display: 'none'
                      }}
                    />
                  </div>

                  {/* Drag and Drop Area */}
                  <div style={{
                    border: '2px dashed #555',
                    borderRadius: '8px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: '#0B0B0C',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    minHeight: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#87CEEB'; e.currentTarget.style.background = '#0f0f0f'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.background = '#0B0B0C'; }}
                  >
                    <div style={{ color: '#87CEEB', fontSize: '64px', marginBottom: '15px' }}>📸</div>
                    <div style={{ color: '#E0E0E0', fontSize: '16px', marginBottom: '8px', fontWeight: '500' }}>
                      {file ? `Selected: ${file.name}` : 'Click here or drag and drop demon photos/reports'}
                    </div>
                    <div style={{ color: '#888', fontSize: '13px' }}>
                      Accepts: Demon photos (JPG, PNG), Mission reports (TXT, PDF, DOC), Evidence files
                    </div>
                  </div>
                  {file && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '20px',
                      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: '#E0E0E0',
                      border: '2px solid #87CEEB',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 4px 6px rgba(135, 206, 235, 0.2)'
                    }}>
                      <div>
                        <strong style={{ color: '#87CEEB', display: 'block', marginBottom: '5px' }}>📎 Evidence File:</strong>
                        <span style={{ color: '#E0E0E0' }}>{file.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#87CEEB', display: 'block', marginBottom: '5px' }}>📊 File Size:</strong>
                        <span style={{ color: '#E0E0E0' }}>{(file.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!file || uploading}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: uploading 
                      ? 'linear-gradient(135deg, #666 0%, #555 100%)'
                      : 'linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)',
                    color: '#0B0B0C',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: uploading ? 'none' : '0 4px 6px rgba(135, 206, 235, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(135, 206, 235, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(135, 206, 235, 0.3)';
                    }
                  }}
                >
                  {uploading ? '⏳ Submitting Report...' : '⚔️ Submit Demon Evidence'}
                </button>
              </form>

              {error && (
                <div style={{
                  background: '#F4433620',
                  border: '2px solid #F44336',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  color: '#ffcccb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '24px' }}>❌</span>
                  <div>
                    <strong style={{ fontSize: '16px', display: 'block', marginBottom: '5px' }}>Upload Error</strong>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              {result && (
                <div style={{
                  background: result.success ? '#4CAF5020' : '#F4433620',
                  border: `2px solid ${result.success ? '#4CAF50' : '#F44336'}`,
                  padding: '25px',
                  borderRadius: '8px',
                  color: result.success ? '#90EE90' : '#ffcccb',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ 
                    marginTop: 0, 
                    marginBottom: '15px',
                    color: result.success ? '#4CAF50' : '#F44336',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span>{result.success ? '✅' : '❌'}</span>
                    {result.success ? 'Mission Report Submitted Successfully' : 'Report Submission Failed'}
                  </h3>
                  
                  <p style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
                    {result.success 
                      ? 'Your demon elimination evidence has been recorded. The Demon Slayer Corps will review this report. Thank you for your service.' 
                      : result.message}
                  </p>

                  {result.success && result.filename && (
                    <div style={{
                      marginTop: '15px',
                      padding: '20px',
                      background: '#0B0B0C',
                      borderRadius: '8px',
                      fontSize: '14px',
                      border: '1px solid #333'
                    }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '15px'
                      }}>
                        <div>
                          <strong style={{ color: '#87CEEB', display: 'block', marginBottom: '5px' }}>Filename:</strong>
                          <span style={{ color: '#E0E0E0' }}>{result.filename}</span>
                        </div>
                        {result.size && (
                          <div>
                            <strong style={{ color: '#87CEEB', display: 'block', marginBottom: '5px' }}>Size:</strong>
                            <span style={{ color: '#E0E0E0' }}>{(result.size / 1024).toFixed(2)} KB</span>
                          </div>
                        )}
                        {result.mimeType && (
                          <div>
                            <strong style={{ color: '#87CEEB', display: 'block', marginBottom: '5px' }}>MIME Type:</strong>
                            <span style={{ color: '#E0E0E0' }}>{result.mimeType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {result.warning && (
                    <div style={{
                      marginTop: '15px',
                      padding: '15px',
                      background: '#FFA50020',
                      border: '1px solid #FFA500',
                      borderRadius: '8px',
                      fontSize: '13px',
                      color: '#FFA500',
                      lineHeight: '1.6'
                    }}>
                      <strong>⚠️ Safety Note:</strong> {result.warning}
                    </div>
                  )}
                </div>
              )}

              {/* Mission Guidelines */}
              <div style={{
                marginTop: '30px',
                padding: '25px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '8px',
                border: '2px solid #87CEEB',
                fontSize: '14px',
                color: '#E0E0E0',
                lineHeight: '1.8',
                boxShadow: '0 4px 6px rgba(135, 206, 235, 0.2)'
              }}>
                <strong style={{ color: '#87CEEB', display: 'block', marginBottom: '15px', fontSize: '18px' }}>
                  📋 Mission Report Guidelines:
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  <div>
                    <strong style={{ color: '#FF6B6B', display: 'block', marginBottom: '8px' }}>📸 Photo Evidence:</strong>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                      <li>Clear image of the demon's remains</li>
                      <li>Show the decapitation point or disintegration</li>
                      <li>Include location markers if possible</li>
                      <li>JPG or PNG format preferred</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: '#FF6B6B', display: 'block', marginBottom: '8px' }}>📝 Written Report:</strong>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                      <li>Demon's appearance and abilities</li>
                      <li>Location and time of encounter</li>
                      <li>Combat techniques used</li>
                      <li>Casualties or injuries sustained</li>
                      <li>TXT, PDF, or DOC format</li>
                    </ul>
                  </div>
                </div>
                <div style={{ 
                  marginTop: '20px', 
                  padding: '15px', 
                  background: '#0B0B0C', 
                  borderRadius: '5px',
                  border: '1px solid #333',
                  fontSize: '12px',
                  color: '#888'
                }}>
                  <strong>⚠️ Security Note:</strong> Files are stored temporarily and automatically deleted after processing. This endpoint is intentionally vulnerable for security training purposes.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Upload;

