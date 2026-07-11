import React, { useState, useRef, useCallback } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import './app.css';

const FRAME_URL = "/Twibbon MPLS.png"; 
const LOGO_URL = "/logo.png";

const App = () => {
  const [image, setImage] = useState(null);
  const [scale, setScale] = useState(1.2); 
  const [rotate, setRotate] = useState(0); 
  const [copySuccess, setCopySuccess] = useState("Salin Caption");
  
  const editorRef = useRef(null);
  const lastPinchDist = useRef(null); 

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setImage(acceptedFiles[0]);
      setScale(1.2);
      setRotate(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: !!image 
  });

  const handleWheel = (e) => {
    if (image) {
      e.preventDefault(); 
      const zoomSensitivity = 0.025; // Lebih kecil = lebih smooth
      const delta = e.deltaY > 0 ? -zoomSensitivity : zoomSensitivity;
      const newScale = Math.min(Math.max(scale + delta, 0.1), 10);
      setScale(newScale);
    }
  };

  const getDistance = (touch1, touch2) => {
    return Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      lastPinchDist.current = dist;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastPinchDist.current) {
      const dist = getDistance(e.touches[0], e.touches[1]);
      const zoomFactor = dist / lastPinchDist.current;
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.1), 10);
      setScale(newScale);
      lastPinchDist.current = dist; 
    }
  };

  const handleTouchEnd = () => {
    lastPinchDist.current = null;
  };

  const handleDownload = async () => {
    if (editorRef.current) {
      // Dapatkan gambar dari editor
      const editorCanvas = editorRef.current.getImage();
      
      // Buat canvas final dengan ukuran pasti 1080x1350
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 1080;
      finalCanvas.height = 1350;
      const ctx = finalCanvas.getContext('2d');
      
      // Gambar foto dari editor ke canvas final
      ctx.drawImage(editorCanvas, 0, 0, 1080, 1350);

      // Gambar bingkai di atasnya
      const frameImg = new Image();
      frameImg.src = FRAME_URL;
      frameImg.crossOrigin = "anonymous"; 
      
      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, 1080, 1350);
        const dataUrl = finalCanvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = 'TWIBBON-MPLS-2026.png';
        link.href = dataUrl;
        link.click();
      };
    }
  };

  const captionText = `I'm ready to find direction and become better with LDKS SMK Telkom Sidoarjo 2026!\n\nHalo teman-teman,\nPerkenalkan, saya [Nama kamu] dari [Organisasi Kamu] selaku Peserta LDKS SMK Telkom Sidoarjo siap menjalani rangkaian kegiatan LDKS dengan penuh semangat, disiplin, dan aktif. Saya siap belajar, berproses, dan tumbuh menjadi pribadi yang lebih tangguh dan bertanggung jawab.\n\nMotto Hidup:\n[Isi dengan motto kamu]\n\n"From Inspiration to Transformation"\nSee you at LDKS SMK Telkom Sidoarjo 2026.\n\n@smktelkomsda @osis.smktelkomsda @mpk.smktelkomsda\n#LDKS2026 #LDKSKOMDA2026 #Leadership`;

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(captionText);
      setCopySuccess("Berhasil Disalin!");
      setTimeout(() => setCopySuccess("Salin Caption"), 3000);
    } catch (err) {
      setCopySuccess("Gagal Menyalin");
    }
  };

  return (
    <div className="app-container">
      {/* Background Decorations */}
      <div className="bg-decorations">
        <div className="crystal-shape crystal-top-left"></div>
        <div className="crystal-shape crystal-bottom-right"></div>
      </div>

      <div className="main-wrapper">
        <div className="header-section">
          <img src={LOGO_URL} alt="SMK Telkom Sidoarjo Logo" className="school-logo" />
          <h1 className="title-main">MPLS & Leadership SMK Telkom Sidoarjo 2026</h1>
          <p className="subtitle">SOLID IN UNITY, STRONGER INTEGRITY</p>
        </div>
        
        <div className="content-wrapper">
          {/* KARTU EDITOR */}
          <div className="card twibbon-card">
          <h2 style={{fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', color: 'var(--white-crystal)'}}>Upload Foto</h2>
          <p className="subtitle" style={{marginBottom: '1.5rem'}}>Cubit untuk zoom, geser untuk atur posisi.</p>
          
          {!image ? (
            <div {...getRootProps()} className={`dropzone-area ${isDragActive ? 'dropzone-active' : ''}`}>
              <input {...getInputProps()} />
              <svg className="icon-upload" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 1rem auto', color: 'var(--metallic-gold)'}}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p style={{letterSpacing: '0.5px'}}>KLIK ATAU TARIK FOTO</p>
            </div>
          ) : (
            <div className="editor-container">
              {/* AREA INTERAKSI */}
              <div 
                className="twibbon-wrapper" 
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AvatarEditor
                  ref={editorRef}
                  image={image}
                  width={1080}
                  height={1350}
                  border={0}
                  scale={scale}
                  rotate={rotate}
                  style={{ background: '#152247', cursor: 'move' }}
                />
                <img src={FRAME_URL} alt="Frame" className="frame-overlay" />
              </div>

              {/* SLIDER CONTROLS */}
              <div className="controls">
                <div className="slider-group">
                    <span className="slider-label">Zoom</span>
                    <input
                      type="range"
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      min="0.1" max="10" step="0.01" value={scale}
                    />
                </div>
                <div className="slider-group">
                    <span className="slider-label">Rotasi</span>
                    <input
                      type="range"
                      onChange={(e) => setRotate(parseFloat(e.target.value))}
                      min="-180" max="180" step="1" value={rotate}
                    />
                </div>
                
                <div className="divider"></div>

                <button className="btn btn-ganti" onClick={() => setImage(null)}>
                  Ganti Foto
                </button>
              </div>
              
              <button className="btn btn-download" onClick={handleDownload}>
                Unduh Twibbon
              </button>
            </div>
          )}
        </div>

        {/* KARTU CAPTION */}
        <div className="card caption-card">
          <h2>Caption</h2>
          <div className="caption-box">
            <p></p>
            <br/>
            
            <p><br/>
             <b></b><b></b> </p>
            <br/>
            
            <p><br/>
            <b></b></p>
            <br/>
            
            <blockquote className="quote">""</blockquote>
            
            <p></p>
            <br/>
            
            <p style={{color: 'var(--accent-blue)', fontWeight: 'bold', fontSize: '0.85rem'}}>
               <br/>
            </p>
          </div>
          
          <button 
            className={`btn btn-copy ${copySuccess.includes("Berhasil") ? 'success' : ''}`} 
            onClick={handleCopyCaption}
          >
            {copySuccess}
          </button>
        </div>

        </div>
      </div>
    </div>
  );
};

export default App;