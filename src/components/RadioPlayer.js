import React, { useEffect, useRef, useState } from 'react';
import { FaVolumeUp, FaVolumeDown, FaPause, FaPlay} from 'react-icons/fa';
import { FaFacebookSquare, FaInstagram, FaYoutube, FaWhatsapp, FaGlobe } from 'react-icons/fa';


const streamUrl = 'http://08.stmip.net:8668/;';
const currentSongUrl = 'https://back-radio-production.up.railway.app/api/currentsong';
const siteUrl = 'https://web-radio-agape.vercel.app/';

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
        .catch(err => {
          console.error('Erro ao iniciar:', err);
          alert('Erro ao iniciar. Tente novamente.');
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
        if (isMounted) {
          setCurrentSong(song || 'Sem informação');
        }
      } catch {
        if (isMounted) {
          setCurrentSong('Erro ao buscar música');
        }
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
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      alert('Compartilhamento não suportado neste dispositivo.');
    }
  };

  // 🎨 Paleta de Cores
  const red = '#d00000';
  const yellow = '#fcbf49';

  return (
    <div style={{
      background: `linear-gradient(135deg, ${red} 40%, ${yellow} 100%)`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        zIndex: 1,
        textAlign: 'center',
        color: '#fff',
        maxWidth: '400px',
        width: '90%',
      }}>
        <img src="/logo.png" alt="Logo Rádio Ágape" style={{
          width: '160px',
          marginBottom: '20px',
        }} />

        <p style={{
          fontSize: '1.1rem',
          color: '#fefefe',
          marginBottom: '6px',
          textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
        }}>Tocando agora:</p>

        <p style={{
          fontSize: '1.6rem',
          fontWeight: 'bold',
          marginBottom: '25px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
          minHeight: '48px'
        }}>
          {currentSong}
        </p>

        <audio ref={audioRef} src={streamUrl} />

        {/* Botão Play/Pause */}
        <button
          onClick={togglePlay}
          style={{
            backgroundColor: red,
            border: 'none',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            color: '#fff',
            fontSize: '2.5rem',
            cursor: 'pointer',
            boxShadow: `0 4px 15px ${red}90`,
            marginBottom: '20px',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Controle de Volume */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '25px',
          color: '#fff',
        }}>
          <FaVolumeDown />
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
              accentColor: yellow,
            }}
          />
          <FaVolumeUp />
        </div>

        {/* Redes Sociais */}
        <div style={{
          display: 'flex',
          gap: '25px',
          justifyContent: 'center',
          fontSize: '2rem',
          cursor: 'pointer',
        }}>
          <a
            href="https://www.facebook.com/comcatolicaagape?locale=pt_BR"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Comunidade Católica Ágape"
            style={{ color: '#fff' }}
          >
            <FaFacebookSquare />
          </a>

          <a
            href="https://www.instagram.com/comagape"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram Comunidade Católica Ágape"
            style={{ color: '#fff' }}
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.youtube.com/@comunidadecatolicaagape7242"
            target="_blank"
            rel="noopener noreferrer"
            title="YouTube Comunidade Católica Ágape"
            style={{ color: '#fff' }}
          >
            <FaYoutube />
          </a>
          <a
            href="https://wa.me/5579999504661?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20Comunidade%20%C3%81gape."
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Comunidade Católica Ágape"
            style={{ color: '#fff' }}
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://comagape.org"
            target="_blank"
            rel="noopener noreferrer"
            title="Site Comunidade Católica Ágape"
            style={{ color: '#fff' }}
          >
            <FaGlobe />
          </a>
        </div>

      </div>
    </div>

  );
};

export default RadioPlayer;
