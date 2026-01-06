"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { AIModel, ConvertTextToSpeech } from "@/services/GlobalServices";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ChatBox from "./_components/ChatBox";

/* ---------- AUDIO UTILS ---------- */
function convertFloat32ToInt16(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;

  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

const DiscussionRoom = () => {
  const { roomid } = useParams();
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // REFS
  const socketRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null); // For Recording
  const playbackContextRef = useRef(null); // For AI Speech
  const processorRef = useRef(null);

  const finalTextRef = useRef("");
  const silenceTimerRef = useRef(null);
  const lastAiCallRef = useRef(0);

  const [conversation, setConversation] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!DiscussionRoomData) return;
    const found = CoachingExpert.find((item) => item.name === DiscussionRoomData.expertName);
    setExpert(found);
  }, [DiscussionRoomData]);

  /* ---------- THE PLAYBACK FIX ---------- */
  const playAiAudio = async (audioUrl) => {
    try {
      // 1. Create Playback Context if it doesn't exist
      if (!playbackContextRef.current || playbackContextRef.current.state === "closed") {
        playbackContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = playbackContextRef.current;

      // 2. Fetch the audio
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      // 3. Decode
      const decodedData = await ctx.decodeAudioData(arrayBuffer);

      // 4. Critical: Resume context right before playing
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // 5. Play
      const source = ctx.createBufferSource();
      source.buffer = decodedData;
      source.connect(ctx.destination);
      source.start(0);
      
      console.log("Audio playing now...");
    } catch (err) {
      console.error("Audio playback failed:", err);
    }
  };

  /* ---------- CONNECT ---------- */
  const connectToServer = async () => {
    try {
      setConnecting(true);
      setEnableMic(true);

      const res = await fetch("/api/getToken");
      const { token } = await res.json();

      const socket = new WebSocket(
        "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&language=en-US&punctuate=true",
        ["token", token]
      );
      socketRef.current = socket;

      socket.onopen = async () => {
        setConnecting(false);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const recordingContext = new AudioContext({ sampleRate: 16000 });
        audioContextRef.current = recordingContext;

        const source = recordingContext.createMediaStreamSource(stream);
        const processor = recordingContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        // Disconnect processor from destination to prevent feedback loop
        source.connect(processor);
        processor.connect(recordingContext.destination);

        processor.onaudioprocess = (e) => {
          if (socket.readyState !== WebSocket.OPEN) return;
          socket.send(convertFloat32ToInt16(e.inputBuffer.getChannelData(0)));
        };
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const transcript = data.channel?.alternatives?.[0]?.transcript;
        if (!transcript || !data.is_final) return;

        finalTextRef.current += " " + transcript;
        clearTimeout(silenceTimerRef.current);

        silenceTimerRef.current = setTimeout(async () => {
          const now = Date.now();
          if (now - lastAiCallRef.current < 1000) return;

          const userMessage = finalTextRef.current.trim();
          if (!userMessage) return;

          finalTextRef.current = "";
          lastAiCallRef.current = now;

          setConversation((prev) => [...prev, { role: "user", content: userMessage }]);
          setAiLoading(true);

          try {
            const currentHistory = [...conversation, { role: "user", content: userMessage }];
            const aiReply = await AIModel(
              DiscussionRoomData.topic,
              DiscussionRoomData.coachingOption,
              currentHistory.slice(-4) // Send last 4 messages for context
            );

            setConversation((prev) => [...prev, { role: "assistant", content: aiReply }]);

            // GENERATE AND PLAY IMMEDIATELY
            const audioUrl = await ConvertTextToSpeech(aiReply, DiscussionRoomData.expertName);
            await playAiAudio(audioUrl);

          } finally {
            setAiLoading(false);
          }
        }, 1500);
      };
    } catch (err) {
      console.error(err);
      setConnecting(false);
      setEnableMic(false);
    }
  };

  const disconnect = () => {
    clearTimeout(silenceTimerRef.current);
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    playbackContextRef.current?.close(); // Close playback
    streamRef.current?.getTracks().forEach((t) => t.stop());
    socketRef.current?.close();
    setEnableMic(false);
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">{DiscussionRoomData?.coachingOption || "Room"}</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            {expert?.avatar && (
              <Image
                src={expert.avatar}
                alt="Avatar"
                width={80}
                height={80}
                style={{ height: "auto" }}
                className="rounded-full animate-pulse"
              />
            )}
            <h2 className="text-gray-500">{expert?.name}</h2>
            <div className="absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={connecting}>
                {connecting && <Loader2Icon className="animate-spin mr-2" />}
                Connect
              </Button>
            ) : (
              <Button variant="destructive" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <ChatBox conversation={conversation} aiLoading={aiLoading} />
      </div>
    </div>
  );
};

export default DiscussionRoom;