import React, { useEffect, useRef, useState } from 'react';
import { FaYoutube, FaFacebook, FaWhatsapp, FaShareAlt, FaVolumeUp, FaVolumeDown, FaPause, FaPlay } from 'react-icons/fa';

const streamUrl = 'http://08.stmip.net:8668/;';
const currentSongUrl = "http://localhost:5000/api/currentsong";
const siteUrl = 'http://localhost:3000';

const RadioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('Carregando...');
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('radioVolume');
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Erro ao reproduzir:', err);
          alert('Não foi possível iniciar a reprodução. Toque para tentar novamente.');
        });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    localStorage.setItem('radioVolume', String(newVolume));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  

  useEffect(() => {
    let isMounted = true;

    const fetchSong = async () => {
      try {
        const res = await fetch(currentSongUrl);
        const text = await res.text();
        const song = text.trim();
        if (isMounted) setCurrentSong(song || 'Sem informação');
      } catch {
        if (isMounted) setCurrentSong('Erro ao buscar música');
      }
    };

    fetchSong();
    const interval = setInterval(fetchSong, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '📻 Rádio Ágape',
          text: 'Ouça agora a Rádio Ágape!',
          url: siteUrl,
        });
      } catch (err) {
        console.error('Erro ao compartilhar', err);
      }
    } else {
      alert('Compartilhamento não suportado neste dispositivo.');
    }
  };

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(135deg, #3b0a0a, #7b1a1a, #a83232)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Playfair Display', serif",
      
      boxSizing: 'border-box',
    }}>
      <img src="/logo.png" alt="Logo Rádio Ágape" style={{ width: '160px', marginBottom: '30px' }} />

      <div style={{
        textAlign: 'center',
        maxWidth: '360px',
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
      }}>
        <p style={{
          fontSize: '1.3rem',
          marginBottom: '8px',
          fontWeight: '600',
          color: '#fcdede',
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
        }}>
          Tocando agora:
        </p>
        <p style={{
          fontSize: '1.7rem',
          fontWeight: '700',
          marginBottom: '25px',
          color: '#fff',
          textShadow: '2px 2px 5px rgba(0,0,0,0.8)',
          minHeight: '48px',
          overflowWrap: 'break-word',
        }}>
          {currentSong}
        </p>

        <audio ref={audioRef} src={streamUrl} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '25px' // mantém o espaçamento de baixo que você já colocou
        }}>
          <button
            onClick={togglePlay}
            style={{
              backgroundColor: '#ef4444',
              border: 'none',
              borderRadius: '50%',
              width: '70px',
              height: '70px',
              color: '#fff',
              fontSize: '2.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.6)',
              transition: 'background-color 0.3s ease',
              userSelect: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc3737'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef4444'}
            aria-label={isPlaying ? 'Pausar rádio' : 'Tocar rádio'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>


        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '15px',
          color: '#fff',
          userSelect: 'none',
        }}>
          <FaVolumeDown size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: '130px',
              cursor: 'pointer',
              borderRadius: '5px',
              backgroundColor: '#fff',
              accentColor: '#ef4444',
              height: '6px',
            }}
            aria-label="Controle de volume"
          />
          <FaVolumeUp size={20} />
        </div>
      </div>

      <div
        style={{
          marginTop: '40px',
          backgroundColor: '#fff',
          padding: '15px 30px',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          color: '#3b0a0a',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
          fontFamily: "'Playfair Display', serif",
        }}>
        <p style={{ fontWeight: 'bold' }}>Conecte-se Conosco:</p>
        <div style={{
          display: 'flex',
          gap: '25px',
          justifyContent: 'center',
          fontSize: '2.3rem',
          color: '#3b0a0a',
          cursor: 'pointer'
        }}>
          <a href="https://www.youtube.com/@comagape" target="_blank" rel="noopener noreferrer" style={{ color: '#3b0a0a' }} title="YouTube" aria-label="YouTube">
            <FaYoutube style={{ transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b0a0a'}
            />
          </a>
          <a href="https://facebook.com/comagape" target="_blank" rel="noopener noreferrer" style={{ color: '#3b0a0a' }} title="Facebook" aria-label="Facebook">
            <FaFacebook style={{ transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b0a0a'}
            />
          </a>
          <a href="https://wa.me/5581999999999" target="_blank" rel="noopener noreferrer" style={{ color: '#3b0a0a' }} title="WhatsApp" aria-label="WhatsApp">
            <FaWhatsapp style={{ transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b0a0a'}
            />
          </a>
          <button onClick={handleShare} style={{
            background: 'none',
            border: 'none',
            color: '#3b0a0a',
            fontSize: '2.3rem',
            cursor: 'pointer',
            padding: 0,
            margin: 0,
          }} title="Compartilhar" aria-label="Compartilhar">
            <FaShareAlt style={{ transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = '#3b0a0a'}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
