import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = import.meta.env.VITE_FRONTEND_API_URL == "http://localhost:3000"
  ? io("http://localhost:4000")
  : io("https://gofilez.com", { path: "/api/socket.io/" });

const VoiceChat = () => {
  const [stream, setStream] = useState(null);
  const audioContextRef = useRef(new AudioContext());
  const remoteAudioRef = useRef();

  // Function to handle starting the audio context after user gesture
  const handleStart = async () => {
    const audioContext = audioContextRef.current;
    try {
      // Resuming AudioContext after user gesture
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Request microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      setupAudioProcessing(mediaStream);
    } catch (error) {
      console.error("Error accessing audio:", error);
    }
  };

  useEffect(() => {
    socket.on("receiveVoice", (data) => {
      playAudio(data);
    });

    return () => {
      socket.off("receiveVoice");
    };
  }, []);

  const setupAudioProcessing = async (stream) => {
    const audioContext = audioContextRef.current;

    // Register the Audio Worklet Processor
    await audioContext.audioWorklet.addModule(URL.createObjectURL(new Blob([`
      class VoiceProcessor extends AudioWorkletProcessor {
        process(inputs, outputs) {
          const input = inputs[0];
          if (input.length > 0) {
            this.port.postMessage(input[0]);
          }
          return true;
        }
      }
      registerProcessor('voice-processor', VoiceProcessor);
    `], { type: 'application/javascript' })));

    const source = audioContext.createMediaStreamSource(stream);
    const processor = new AudioWorkletNode(audioContext, "voice-processor");

    processor.port.onmessage = (event) => {
      const audioData = event.data;
      if (audioData.some(sample => sample !== 0)) {
        socket.emit("voiceData", { audio: Array.from(audioData) });
      }
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  };

  const playAudio = (data) => {
    const audioContext = audioContextRef.current;

    if (!data || data.audio.length === 0) {
      console.warn("Received empty audio data, skipping playback.");
      return;
    }

    const buffer = audioContext.createBuffer(1, data.audio.length, audioContext.sampleRate);
    buffer.copyToChannel(new Float32Array(data.audio), 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  };

  return (
    <div>
      <h2>🎤 Real-Time Voice Chat</h2>
      <button onClick={handleStart}>
        Start Voice Chat
      </button>
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default VoiceChat;
