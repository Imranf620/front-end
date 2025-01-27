import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Button, Card, Typography, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { useSelector } from "react-redux";

const socket =
  import.meta.env.VITE_FRONTEND_API_URL === "http://localhost:3000"
    ? io("http://localhost:4000")
    : io("https://gofilez.com", { path: "/api/socket.io/" });

const VoiceChat = ({ video }) => {
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);  // Mute state for the mic
  const remoteAudio = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  const { user } = useSelector((state) => state.auth);

  const isInvitedUser = video.invites.some((invite) => invite.inviteeId === user.user.id);
  const isVideoUploader = video.uploadedBy === user.user.id;

  const createPeerConnection = () => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection(servers);

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) socket.emit("ice-candidate", event.candidate);
      };

      peerConnectionRef.current.ontrack = (event) => {
        remoteAudio.current.srcObject = event.streams[0];
      };
    }
  };

  const startCall = async () => {
    setIsCallStarted(true);
    createPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    stream.getTracks().forEach((track) =>
      peerConnectionRef.current.addTrack(track, stream)
    );

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    socket.emit("offer", offer, video.id);
    socket.emit("startAudioCall");
  };

  const stopCall = () => {
    setIsCallStarted(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (remoteAudio.current) {
      remoteAudio.current.srcObject = null;
    }

    socket.emit("stopAudioCall");
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = !track.enabled;
        }
      });
    }
    setIsMuted(!isMuted);
    socket.emit("toggleMute");
  };

  useEffect(() => {
    socket.on("offer", async (offer) => {
      createPeerConnection();
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      stream.getTracks().forEach((track) =>
        peerConnectionRef.current.addTrack(track, stream)
      );

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (answer) => {
      if (peerConnectionRef.current && peerConnectionRef.current.signalingState !== "stable") {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("audioCallState", (state) => {
      setIsCallStarted(state.isCallStarted);
      setIsMuted(state.isMuted);
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("audioCallState");

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [isMuted]);

  return (
    <div className="flex items-center justify-center mt-10 bg-gray-100">
      <Card className="p-6 shadow-lg rounded-xl bg-white text-center w-96">
        <Typography variant="h5" className="mb-4 font-semibold">
          WebRTC Voice Chat
        </Typography>

        <Button
          variant="contained"
          color="primary"
          className="w-full mb-4"
          onClick={startCall}
          disabled={isCallStarted || !(isVideoUploader || isInvitedUser)}
        >
          {isCallStarted ? "Call Started" : "Start Call"}
        </Button>

        {isCallStarted && (
          <Button
            variant="contained"
            color="secondary"
            className="w-full mb-4"
            onClick={stopCall}
          >
            Stop Call
          </Button>
        )}

        <IconButton
          onClick={isCallStarted?stopCall:startCall}
          color={isMuted ? "error" : "success"}
          className="w-12 h-12 mx-auto"
        >
          {!isCallStarted ? <MicOffIcon fontSize="large" /> : <MicIcon fontSize="large" />}
        </IconButton>

        <audio ref={remoteAudio} autoPlay></audio>
      </Card>
    </div>
  );
};

export default VoiceChat;
