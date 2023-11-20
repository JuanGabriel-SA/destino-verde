import React, { useRef } from 'react';
import Webcam from 'react-webcam';

export default function CameraComponent() {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // Faça algo com a imagem capturada, como enviá-la para o servidor ou exibi-la na página.
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div>
      <Webcam
         audio={false}
         height={720}
         screenshotFormat="image/jpeg"
         width={1280}
         videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capturar</button>
    </div>
  );
}
