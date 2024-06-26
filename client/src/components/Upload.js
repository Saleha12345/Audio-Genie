import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Chart from "chart.js/auto";
import "../styles/Home.css";
import { FileUploader } from "react-drag-drop-files";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LinearProgress from "@mui/material/LinearProgress";
import { useDropzone } from "react-dropzone";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import backgroundImage from "../img/8503.jpg";
import { useUser } from './UserContext';

const fileTypes = ["WAV"];

const AudioSeparationForm = ({ username }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [separatedAudio, setSeparatedAudio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volumes, setVolumes] = useState([]);
  const [muted, setMuted] = useState([]);
  const [segmentedTracks, setSegmentedTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [transcriptionResults, setTranscriptionResults] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);

  const canvasRef = useRef([]);
  const audioRef = useRef([]);
  const source = useRef([]);
  const analyzer = useRef([]);
  const animationController = useRef([]);
  const { signupDetails } = useUser();
  const { email } = signupDetails;

  const handleMuteToggle = (index) => {
    const newMuted = [...muted];
    newMuted[index] = !newMuted[index];
    setMuted(newMuted);
    audioRef.current[index].muted = newMuted[index];
  };

  const handleVolumeChange = (index, event) => {
    const newVolumes = [...volumes];
    newVolumes[index] = parseFloat(event.target.value);
    setVolumes(newVolumes);
    audioRef.current[index].volume = newVolumes[index];
  };

  const separateAndSegmentAudio = async () => {
    setLoading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await axios.post(
        " https://75b9-34-73-77-170.ngrok-free.app/separate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let progress = 0;
            const interval = setInterval(() => {
              progress += 1;
              setProgress(progress);
              if (progress >= 100) {
                clearInterval(interval);
              }
            }, 2500);
          },
        }
      );

      if (!Array.isArray(response.data.audio_tracks)) {
        console.error("Received unexpected data from server");
        setLoading(false);
        return;
      }

      const separatedAudioTracks = response.data.audio_tracks;
      const formattedAudioTracks = await Promise.all(
        separatedAudioTracks.map(async (audioData, index) => {
          const normalizedAudioData = normalizeAudioData(audioData);
          const audioContext = new AudioContext();
          const audioBuffer = audioContext.createBuffer(
            1,
            normalizedAudioData.length,
            8000
          );
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < normalizedAudioData.length; i++) {
            channelData[i] = normalizedAudioData[i];
          }
          audioContext.close();

          const audiobufferToBlob = require("audiobuffer-to-blob");
          const blob = audiobufferToBlob(audioBuffer);
          const url = URL.createObjectURL(blob);
          const response = await fetch(url);
          const blobData = await response.blob();

          return new File([blobData], `separated_audio_${index}.wav`, {
            type: "audio/wav",
          });
        })
      );

      for (let i = 0; i < formattedAudioTracks.length; i++) {
        const transcribeFormData = new FormData();
        transcribeFormData.append("audio", formattedAudioTracks[i]);
        const transcriptionResponse = await axios.post(
          " https://75b9-34-73-77-170.ngrok-free.app/transcribe",
          transcribeFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );


        if (transcriptionResponse.data.transcriptions) {
          transcriptionResults.push(transcriptionResponse.data.transcriptions);

        }
      }

      setTranscriptionResults(transcriptionResults);
      console.log(transcriptionResults);
      setLoading(false);

      for (let i = 0; i < formattedAudioTracks.length; i++) {
        const formDataSegmentation = new FormData();
        formDataSegmentation.append("audio", formattedAudioTracks[i]);

        const segmentationResponse = await axios.post(
          " https://75b9-34-73-77-170.ngrok-free.app/segment",
          formDataSegmentation,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (segmentationResponse.data.segmentation) {
          segmentedTracks.push(segmentationResponse.data.segmentation);
        }
      }

      console.log(segmentedTracks);
      setSegmentedTracks(segmentedTracks);

      setSeparatedAudio(separatedAudioTracks);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      alert("Server is currently busy. Please try again later.");
    }
  };
  const handleAudioPlay = (index) => {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (!source.current[index]) {
      source.current[index] = audioContext.createMediaElementSource(
        audioRef.current[index]
      );
      analyzer.current[index] = audioContext.createAnalyser();
      analyzer.current[index].fftSize = 256;
      source.current[index].connect(analyzer.current[index]);
      analyzer.current[index].connect(audioContext.destination);
    }
    visualizeData(index);
  };

  const visualizeData = (index) => {
    animationController[index] = requestAnimationFrame(() =>
      visualizeData(index)
    );
    if (audioRef.current[index].paused) {
      cancelAnimationFrame(animationController[index]);
    }
    const bufferLength = analyzer.current[index].frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const ctx = canvasRef.current[index].getContext("2d");
    ctx.clearRect(
      0,
      0,
      canvasRef.current[index].width,
      canvasRef.current[index].height
    );

    const barWidth = (canvasRef.current[index].width / bufferLength) * 2.5;
    let x = 0;

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvasRef.current[index].width,
      0
    );
    gradient.addColorStop(0, "#0F0089");
    gradient.addColorStop(0.5, "#485687");
    gradient.addColorStop(1, "#FF00FF");

    analyzer.current[index].getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];
      ctx.fillStyle = gradient;
      ctx.fillRect(
        x,
        canvasRef.current[index].height - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      x += barWidth + 1;
    }
  };

  const playSeparatedAudio = (audioData) => {
    const normalizedAudioData = normalizeAudioData(audioData);
    const audioContext = new AudioContext();
    const audioBuffer = audioContext.createBuffer(
      1,
      normalizedAudioData.length,
      8000
    );
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < normalizedAudioData.length; i++) {
      channelData[i] = normalizedAudioData[i];
    }
    audioContext.close();

    const audiobufferToBlob = require("audiobuffer-to-blob");
    const blob = audiobufferToBlob(audioBuffer);
    const url = URL.createObjectURL(blob);

    return url;
  };

  const normalizeAudioData = (audioData) => {
    const maxAmplitude = Math.max(...audioData.map(Math.abs));
    const normalizedAudioData = audioData.map((value) => value / maxAmplitude);

    return normalizedAudioData;
  };

  const avatarImages = [
    require("../img/avatar_11.jpg"),
    require("../img/avatar_12.jpg"),
  ];

  const handleDownload = (audioData, index) => {
    const normalizedAudioData = normalizeAudioData(audioData);
    const audioContext = new AudioContext();
    const audioBuffer = audioContext.createBuffer(
      1,
      normalizedAudioData.length,
      8000
    );
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < normalizedAudioData.length; i++) {
      channelData[i] = normalizedAudioData[i];
    }
    audioContext.close();

    const audiobufferToBlob = require("audiobuffer-to-blob");
    const blob = audiobufferToBlob(audioBuffer);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `separated_audio_${index}.wav`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const visualizeSegmentationData = () => {
    let maleCount = 0;
    let femaleCount = 0;
    let noEnergyCount = 0;
    let speakerLabels = [];
    let startTimeData = [];
    let endTimeData = [];
    segmentedTracks.forEach((segmentedTrack, index) => {
      let speakerName = `Speaker ${index + 1}`;
      segmentedTrack.forEach((segment) => {
        const [gender, startTime, endTime] = segment;
        startTimeData.push(startTime);
        endTimeData.push(endTime);
        speakerLabels.push(speakerName);

        if (gender === "male") {
          maleCount++;
        } else if (gender === "female") {
          femaleCount++;
        } else if (gender === "noEnergy") {
          noEnergyCount++;
        }
      });
    });

    const canvasContainer = document.getElementById("pie-chart-container");
    const pieChartCanvas = document.createElement("canvas");
    pieChartCanvas.id = "gender-pie-chart";
    canvasContainer.innerHTML = "";
    canvasContainer.appendChild(pieChartCanvas);
    const pieCtx = pieChartCanvas.getContext("2d");
    new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["Male", "Female", "No Energy"],
        datasets: [
          {
            data: [maleCount, femaleCount, noEnergyCount],
            backgroundColor: ["#36a2eb", "#ff6384", "#ffce56"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Gender Distribution'
          }
        }
      }
    });

    const barChartContainer = document.getElementById("bar-chart-container");
    const barChartCanvas = document.createElement("canvas");
    barChartCanvas.id = "gender-bar-chart";
    barChartContainer.innerHTML = "";
    barChartContainer.appendChild(barChartCanvas);
    const barCtx = barChartCanvas.getContext("2d");
    new Chart(barCtx, {
      type: "bar",
      data: {
        labels: speakerLabels,
        datasets: [
          {
            label: "Start Time",
            data: startTimeData,
            backgroundColor: "#ff6384",
          },
          {
            label: "End Time",
            data: endTimeData,
            backgroundColor: "#36a2eb",
          },
        ],
      },

      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Speaker Timeline'
          }
        }
      },
    });
  };
  const handleVisualizationClick = () => {
    visualizeSegmentationData();
  };

  const handleCheckboxChange = (index) => {
    const updatedSelectedTracks = [...selectedTracks];
    updatedSelectedTracks[index] = !updatedSelectedTracks[index];
    setSelectedTracks(updatedSelectedTracks);
  };
  const handleConcatenateAndDownload = () => {
    const selectedAudioTracks = separatedAudio.filter(
      (_, index) => selectedTracks[index]
    );

    if (selectedAudioTracks.length < 2) {
      alert("Please select at least 2 audio tracks to concatenate.");
      return;
    }

    const audioContext = new AudioContext();
    const buffers = [];

    selectedAudioTracks.forEach((audioData) => {
      const normalizedAudioData = normalizeAudioData(audioData);
      const audioBuffer = audioContext.createBuffer(
        1,
        normalizedAudioData.length,
        8000
      );
      const channelData = audioBuffer.getChannelData(0);
      normalizedAudioData.forEach(
        (value, index) => (channelData[index] = value)
      );
      buffers.push(audioBuffer);
    });

    const mergedBuffer = audioContext.createBuffer(
      1,
      buffers.reduce((acc, buffer) => acc + buffer.length, 0),
      8000
    );

    let offset = 0;
    buffers.forEach((buffer) => {
      mergedBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
      offset += buffer.length;
    });

    const audiobufferToBlob = require("audiobuffer-to-blob");
    const blob = audiobufferToBlob(mergedBuffer);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "concatenated_audio.wav";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value);
  };


  const handleFileChange = async (file) => {
    const { name, type } = file;
    const currentDate = new Date();

    if (file && file.type === 'audio/wav') {

      setUploadStatus('success');
      setAudioFile(file);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;

        try {
          await axios.post("http://localhost:3001/savefiles", {
            name: name,
            date: currentDate,
            type: type,
            email: email,
            content: fileContent
          });
          console.log("File information sent to backend MongoDB.");
        } catch (error) {
          console.error("Error sending file information to backend MongoDB:", error);
        }
      };

      reader.readAsDataURL(file);
    } else {
      setUploadStatus('error');
    }
  };


  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false, accept: 'audio/wav' });

  return (
    <div>
      <div className="fileuploadercontainer" style={{ marginTop: "20px" }}>
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed black",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: isDragActive ? "#f7f7f7" : "#ffffff",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "90% 140%",
            height: "300px",
            position: "relative",
          }}
        >
          <input {...getInputProps()} handleChange={handleFileChange} type="audioFile" types={fileTypes} />
          {isDragActive ? (
            <p>Drop the audio file here...</p>
          ) : (
            <p>Drag and drop audio file here, or click to select file</p>
          )}
        </div>
      </div>
      <div style={{ marginBottom: '10px', marginTop: '5px' }}>
        {uploadStatus === 'success' && (
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            File upload successfully!
          </Alert>
        )}

        {uploadStatus === 'error' && (
          <Alert severity="error">
            Error: Please upload a .wav audio file.
          </Alert>
        )}


      </div>

      <input
        type="text"
        placeholder="Enter keyword to search..."
        value={searchKeyword}
        onChange={handleSearchInputChange}
        style={{ marginTop: "10px", marginBottom: "10px", width: "300px" }}
      />



      {/* Separate and segment audio button */}
      <button
        onClick={separateAndSegmentAudio}
        disabled={!audioFile || loading}
        style={{
          marginTop: "20px",
          backgroundColor: !audioFile || loading ? "#94b0e8" : "#002366",
          color: "#fff",
          borderColor: "#002366",
        }}
      >
        Separate
      </button>

      {/* Loading bar */}
      {loading && (
        <div style={{ width: "100%", marginTop: "20px" }}>
          <LinearProgress variant="determinate" value={progress} />
        </div>
      )}

      {/* Render separated audio tracks */}
      {separatedAudio.map((audioData, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            border: "2px solid #0019b5",
            borderRadius: "10px",
            backgroundColor: "white",
            paddingBottom: "30px",
            marginBottom: "5px",
            width: "fit-content",
          }}
        >
          <input
            type="checkbox"
            checked={selectedTracks[index] || false}
            onChange={() => handleCheckboxChange(index)}
            style={{
              marginLeft: "15px",
              width: "20px",
              height: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0",
              marginTop: "200px",
            }}
          />
          {segmentedTracks[index] && segmentedTracks[index][0] && (
            <img
              src={
                segmentedTracks[index][0][0] === "male"
                  ? avatarImages[1]
                  : avatarImages[0]
              }
              alt={`Avatar ${index + 1}`}
              style={{
                borderRadius: "20px",
                marginRight: "20px",
                marginBottom: "-180px",
              }}
            />
          )}

          {/* Audio player */}
          {audioData && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "-200px",
                width: "850px",
              }}
            >
              {/* Audio player with volume control */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <audio
                  style={{ width: "1px" }}
                  ref={(ref) => (audioRef.current[index] = ref)}
                  controls
                  volume={volumes[index] || 1}
                  onPlay={() => handleAudioPlay(index)}
                >
                  <source
                    src={playSeparatedAudio(audioData)}
                    type="audio/mp3"
                  />
                </audio>
                {/* Play button */}
                <button
                  onClick={() => audioRef.current[index].play()}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "10px",
                    marginRight: "5px",
                  }}
                >
                  <PlayArrowIcon
                    style={{ marginRight: "5px", paddingBottom: "4px" }}
                  />
                  Play
                </button>

                {/* Mute button */}
                <button
                  onClick={() => handleMuteToggle(index)}
                  style={{
                    marginLeft: "-2px",
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "10px",
                  }}
                >
                  <VolumeOffIcon
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      paddingBottom: "4px",
                    }}
                  />{" "}
                  {muted[index] ? "Unmute" : "Mute"}
                </button>
                {/* Download button */}
                <button
                  onClick={() => handleDownload(audioData, index)}
                  style={{
                    marginLeft: "-7px",
                    marginRight: "-5px",
                    display: "flex",
                    flexDirection: "row",
                    paddingTop: "10px",
                  }}
                >
                  <DownloadIcon
                    style={{
                      marginRight: "5px",
                      width: "20px",
                      paddingBottom: "4px",
                    }}
                  />
                  Download
                </button>
              </div>

              {/* Canvas for audio visualization */}
              <canvas
                ref={(ref) => (canvasRef.current[index] = ref)}
                width={500}
                height={200}
                style={{ marginBottom: "180px", paddingLeft: "20px" }}
              />
            </div>
          )}
          {/* Display transcription results for current track */}
          <div style={{ marginRight: "10px", marginLeft: "-250px" }}>
            {transcriptionResults[index] && (
              <div style={{ marginRight: "10px" }}>
                {transcriptionResults[index].map((item, subIndex) => (
                  <Accordion key={subIndex}>
                    <AccordionSummary
                      expandIcon={<ArrowDownwardIcon />}
                      aria-controls={`panel${subIndex + 1}-content`}
                      id={`panel${subIndex + 1}-header`}
                    >
                      <Typography style={{ color: "black" }}>
                        Transcript
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ width: "200px" }}>
                      <div>
                        <div style={{ color: "green" }}>
                          <strong
                            style={{ color: "green", paddingRight: "10px" }}
                          >
                            Start Time:
                          </strong>{" "}
                          {item.start}s
                        </div>
                        <div style={{ color: "red" }}>
                          <strong
                            style={{ color: "red", paddingRight: "10px" }}
                          >
                            End Time:
                          </strong>{" "}
                          {item.end}s
                        </div>
                        {/* Render the transcription text with highlighted keyword */}
                        <div>
                          <strong
                            style={{ color: "gray", paddingRight: "10px" }}
                          >
                            Transcription Text:
                          </strong>{" "}
                          {item.text
                            .split(new RegExp(`(${searchKeyword})`, "gi"))
                            .map((part, i) =>
                              part.toLowerCase() ===
                                searchKeyword.toLowerCase() ? (
                                <mark key={i}>{part}</mark>
                              ) : (
                                <React.Fragment key={i}>{part}</React.Fragment>
                              )
                            )}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={handleVisualizationClick}
        disabled={!segmentedTracks.length}
        style={{
          marginTop: "60px",
          marginBottom: "20px",
          backgroundColor: !segmentedTracks.length ? "#94b0e8" : "#002366",
          color: "#fff",
          borderColor: "#002366",
        }}
      >
        Visualize
      </button>
      <button
        onClick={handleConcatenateAndDownload}
        disabled={
          !audioFile ||
          loading ||
          selectedTracks.filter((track) => track).length < 2
        }
        style={{
          marginTop: "20px",
          backgroundColor:
            !audioFile ||
              loading ||
              selectedTracks.filter((track) => track).length < 2
              ? "#94b0e8"
              : "#002366",
          color: "#fff",
          borderColor: "#002366",
        }}
      >
        Download
      </button>

      <div style={{ display: "flex", flexDirection: "row" }}>

        <div
          id="bar-chart-container"
          style={{
            width: "400px",
            height: "auto",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px",
            marginRight: "10px",
          }}
        >  </div>

        <div
          id="pie-chart-container"
          style={{
            width: "400px",
            height: '300px',
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "10px",
            paddingLeft: '60px'
          }}
        ></div>
      </div>

    </div>
  );
};

export default AudioSeparationForm;
