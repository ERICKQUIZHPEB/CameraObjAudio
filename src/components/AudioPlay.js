// AudioPlay.js
import { useEffect, useState } from 'react';

const AudioPlay = ({ audioUrl, condition }) => {
    const [audioElement, setAudioElement] = useState(null);

    useEffect(() => {
        setAudioElement(new Audio(audioUrl));
      }, [audioUrl]);
    
      useEffect(() => {
        if (audioElement && condition) {
          audioElement.play();
        }
      }, [audioElement, condition]);
    
      return null; // Este componente no renderiza nada en el DOM
    };
export default AudioPlay;
