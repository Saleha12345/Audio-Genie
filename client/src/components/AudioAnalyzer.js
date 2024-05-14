import React, { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

const AudioAnalyzer = ({ audioUrl }) => {
  const analyzerRef = useRef(null);
  const isAudioStartedRef = useRef(false);
  const [audioContextStarted, setAudioContextStarted] = useState(false);

  useEffect(() => {
    // Create an analyzer node
    const analyzer = new Tone.Analyser('waveform', 1024); // Adjust parameters as needed

    // Store the analyzer node in the ref for further use
    analyzerRef.current = analyzer;

    // Cleanup function
    return () => {
      // Dispose the analyzer to release resources
      analyzer.dispose();
    };
  }, []);

  // Function to start analyzing audio
  const startAnalysis = () => {
    // Check if audio context is already started
    if (!isAudioStartedRef.current) {
      // Start the audio context only if it hasn't been started before
      if (!audioContextStarted) {
        // Start the audio context within a user gesture
        Tone.start();
        // Set the flag to true to indicate that the audio context has been started
        setAudioContextStarted(true);
      }

      // Set the flag to true to indicate that audio has been started
      isAudioStartedRef.current = true;
    }

    // Start the analyzer
    Tone.Transport.start();
    // Connect the analyzer to the master output
    analyzerRef.current.connect(Tone.Master);
  };

  // Function to stop analyzing audio
  const stopAnalysis = () => {
    // Stop the analyzer
    Tone.Transport.stop();
    // Disconnect the analyzer from the master output
    analyzerRef.current.disconnect();
  };

  return (
    <div>
      {/* Add buttons to start and stop analysis */}
      <button onClick={startAnalysis}>Start Analysis</button>
      <button onClick={stopAnalysis}>Stop Analysis</button>
    </div>
  );
};

export default AudioAnalyzer;
