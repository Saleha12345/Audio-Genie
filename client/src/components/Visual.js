// App.js

import { useRef, useState } from "react";
import "./styles.css";
import WaveForm from "./Waveform";
export default function Visual() {
  const [audioUrl, setAudioUrl] = useState();
  const [analyzerData, setAnalyzerData] = useState(null);
  const audioElmRef = useRef(null);

  // audioAnalyzer function analyzes the audio and sets the analyzerData state
  const audioAnalyzer = () => {
    // create a new AudioContext
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // create an analyzer node with a buffer size of 2048
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const source = audioCtx.createMediaElementSource(audioElmRef.current);
    source.connect(analyzer);
    source.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
    };

    // set the analyzerData state with the analyzer, bufferLength, and dataArray
    setAnalyzerData({ analyzer, bufferLength, dataArray });
  };

  // onFileChange function handles the file input and triggers the audio analysis
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
    audioAnalyzer();
  };

  return (
    <div className="App">
      <h1>Audio Visualizer</h1>
      {analyzerData && <WaveForm analyzerData={analyzerData} />}
      <div
        style={{
          height: 80,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <input type="file" accept="audio/*" onChange={onFileChange} />
        <audio src={audioUrl ?? ""} controls ref={audioElmRef} />
      </div>
    </div>
  );
}