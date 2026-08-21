/**
 * ChatWave 3.0 - Full Mesh WebRTC Voice, Video & Screen-Sharing Engine
 * Features: Multi-party mesh audio/video, noise suppression, audio gain analysis, screen sharing, recording.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveWebRTC = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const ICE_SERVERS = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' }
    ]
  };

  class WebRTCManager {
    constructor() {
      this.localStream = null;
      this.screenStream = null;
      this.peers = new Map(); // peerId -> RTCPeerConnection
      this.remoteStreams = new Map(); // peerId -> MediaStream
      this.audioContext = null;
      this.audioAnalyser = null;
      this.isMuted = false;
      this.isVideoMuted = false;
      this.isScreenSharing = false;
      this.mediaRecorder = null;
      this.recordedChunks = [];
      this.callStartTime = 0;
      this.activeCall = null;
    }

    async initLocalStream(video = true, audio = true) {
      try {
        const constraints = {
          audio: audio ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } : false,
          video: video ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } : false
        };

        this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
        this.setupAudioAnalyser(this.localStream);
        return this.localStream;
      } catch (err) {
        console.error('Failed to get media devices:', err);
        throw err;
      }
    }

    setupAudioAnalyser(stream) {
      try {
        if (!this.audioContext) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new AudioContext();
        }
        const source = this.audioContext.createMediaStreamSource(stream);
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.fftSize = 64;
        source.connect(this.audioAnalyser);
      } catch (e) {
        console.warn('Could not setup audio analyser:', e);
      }
    }

    getAudioLevel() {
      if (!this.audioAnalyser) return 0;
      const dataArray = new Uint8Array(this.audioAnalyser.frequencyBinCount);
      this.audioAnalyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      return sum / dataArray.length / 255;
    }

    createPeer(peerId, isInitiator, onSignal) {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      this.peers.set(peerId, pc);

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          pc.addTrack(track, this.localStream);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate && typeof onSignal === 'function') {
          onSignal({ type: 'candidate', candidate: event.candidate, targetId: peerId });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0] || new MediaStream([event.track]);
        this.remoteStreams.set(peerId, remoteStream);
        if (root.ChatWaveEventBus) {
          root.ChatWaveEventBus.emit('webrtc:track', { peerId, stream: remoteStream, track: event.track });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          this.closePeer(peerId);
        }
      };

      if (isInitiator) {
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).then(() => {
          if (typeof onSignal === 'function') {
            onSignal({ type: 'offer', sdp: pc.localDescription, targetId: peerId });
          }
        }).catch(err => console.error('Error creating offer:', err));
      }

      return pc;
    }

    async handleSignal(signal, onSignal) {
      const peerId = signal.fromId || signal.senderId;
      if (!peerId) return;

      let pc = this.peers.get(peerId);
      if (!pc && signal.type === 'offer') {
        pc = this.createPeer(peerId, false, onSignal);
      }

      if (!pc) return;

      if (signal.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        if (typeof onSignal === 'function') {
          onSignal({ type: 'answer', sdp: pc.localDescription, targetId: peerId });
        }
      } else if (signal.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      } else if (signal.type === 'candidate' && signal.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    }

    toggleAudio() {
      if (!this.localStream) return false;
      this.isMuted = !this.isMuted;
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMuted;
      });
      return !this.isMuted;
    }

    toggleVideo() {
      if (!this.localStream) return false;
      this.isVideoMuted = !this.isVideoMuted;
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = !this.isVideoMuted;
      });
      return !this.isVideoMuted;
    }

    async startScreenShare() {
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const screenTrack = this.screenStream.getVideoTracks()[0];
        
        // Replace video track in all active peer connections
        for (const [peerId, pc] of this.peers.entries()) {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        screenTrack.onended = () => {
          this.stopScreenShare();
        };

        this.isScreenSharing = true;
        return this.screenStream;
      } catch (e) {
        console.error('Error starting screen share:', e);
        throw e;
      }
    }

    stopScreenShare() {
      if (!this.isScreenSharing) return;
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(t => t.stop());
        this.screenStream = null;
      }

      if (this.localStream) {
        const localVideoTrack = this.localStream.getVideoTracks()[0];
        for (const [peerId, pc] of this.peers.entries()) {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender && localVideoTrack) {
            sender.replaceTrack(localVideoTrack);
          }
        }
      }
      this.isScreenSharing = false;
    }

    closePeer(peerId) {
      const pc = this.peers.get(peerId);
      if (pc) {
        pc.close();
        this.peers.delete(peerId);
      }
      this.remoteStreams.delete(peerId);
      if (root.ChatWaveEventBus) {
        root.ChatWaveEventBus.emit('webrtc:peer_left', { peerId });
      }
    }

    endAllCalls() {
      for (const peerId of this.peers.keys()) {
        this.closePeer(peerId);
      }
      if (this.localStream) {
        this.localStream.getTracks().forEach(t => t.stop());
        this.localStream = null;
      }
      this.stopScreenShare();
      this.activeCall = null;
    }
  }

  return new WebRTCManager();
}));
