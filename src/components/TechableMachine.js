import React, { useEffect, useState } from 'react';
import '../styles.css';
import AudioPlay from './AudioPlay';

const TeachableMachine = () => {
  const URL = 'https://teachablemachine.withgoogle.com/models/KqeyrDAF8/';
  let model, webcam, labelContainer, maxPredictions;

  const [detectedObject, setDetectedObject] = useState('');
  const [audioCondition, setAudioCondition] = useState(false);

  const probabilityThreshold = 0.95 ;

  const initCamera = async () => {
    try {
      if (!webcam) {
        const modelURL = URL + 'model.json';
        const metadataURL = URL + 'metadata.json';

        model = await window.tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new window.tmImage.Webcam(200, 200, flip, { framerate: 1 });

        await webcam.setup();
        await webcam.play();
        document.getElementById('webcam-container').appendChild(webcam.canvas);

        labelContainer = document.getElementById('label-container');
        for (let i = 0; i < maxPredictions; i++) {
          labelContainer.appendChild(document.createElement('div'));
        }

        window.requestAnimationFrame(loop);
      }
    } catch (error) {
      console.error('Error al configurar la cámara:', error.message);
    }
  };

  const loop = async () => {
    if (webcam) {
      webcam.update();
      const smallCanvas = document.createElement('canvas');
      const smallContext = smallCanvas.getContext('2d');
      smallCanvas.width = 100;
      smallCanvas.height = 100;
      smallContext.drawImage(webcam.canvas, 0, 0, 100, 100);
      await predict();
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.requestAnimationFrame(loop);
    }
  };

  const predict = async () => {
    try {
      if (model && webcam && labelContainer) {
        const prediction = await model.predict(webcam.canvas);

        const maxPrediction = prediction.reduce((max, current) =>
          current.probability > max.probability ? current : max
        );

        if (maxPrediction.probability > probabilityThreshold) {
          const classPrediction = maxPrediction.className + ':' + maxPrediction.probability.toFixed(2);
          labelContainer.innerHTML = classPrediction;

          setDetectedObject(maxPrediction.className);
          setAudioCondition(maxPrediction.className);
        } else {
          labelContainer.innerHTML = 'Analizando...';
        }
      } else {
        console.error('Modelo, webcam o labelContainer no están definidos.');
      }
    } catch (error) {
      console.error('Error en la predicción:', error.message);
    }
  };

  useEffect(() => {
    initCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer;
    if (audioCondition) {
      timer = setTimeout(() => {
        setAudioCondition(false);
      }, 5000); // 5 segundos
    }

    return () => {
      clearTimeout(timer);
    };
  }, [audioCondition]);

  useEffect(() => {
    return () => {
      if (webcam) {
        webcam.stop();
      }
    };
  }, [webcam]);

  return (
    <div>
      <div className='model-title'>Teachable Machine Image Model</div>
      <button type="button" onClick={initCamera} className="start-button">
        Start
      </button>
      {audioCondition && <AudioPlay audioUrl={`/audios/${detectedObject}.mp3`} condition={audioCondition} />}
      <div id="webcam-container"></div>
      <div id="label-container"></div>
    </div>
  );
};

export default TeachableMachine;
