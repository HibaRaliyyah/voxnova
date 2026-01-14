"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { AIModel, ConvertTextToSpeech } from "@/services/GlobalServices";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { useMutation, useQuery } from "convex/react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import ChatBox from "./_components/ChatBox";
import { UserContext } from "@/app/_context/UserContext";
import { toast } from "react-toastify";
import Webcam from "react-webcam";

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
  const { userData, setUserData } = useContext(UserContext);
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  const [expert, setExpert] = useState(null);
  const [enableMic, setEnableMic] = useState(false);
  const [connecting, setConnecting] = useState(false);

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
  const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
  const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
  const updateUserToken = useMutation(api.users.UpdateUserToken);
  const [enableCamera, setEnableCamera] = useState(false);


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
      toast.success('Connected')
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

      socket.onmessage = async (event) => {
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
          await updateUserTokenMethod(userMessage); //update User generated Token

          try {
            const currentHistory = [...conversation, { role: "user", content: userMessage }];
            const aiReply = await AIModel(
              DiscussionRoomData.topic,
              DiscussionRoomData.coachingOption,
              currentHistory.slice(-4) // Send last 4 messages for context
            );

            setConversation((prev) => [...prev, { role: "assistant", content: aiReply }]);
            await updateUserTokenMethod(aiReply); //update AI generated Token

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

  /* ---------- DISCONNECT ---------- */
  const disconnect = async () => {
    clearTimeout(silenceTimerRef.current);
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    playbackContextRef.current?.close(); // Close playback
    streamRef.current?.getTracks().forEach((t) => t.stop());
    socketRef.current?.close();
    setEnableMic(false);
    toast.error('Disconnected!')
    await UpdateConversation({
      id: DiscussionRoomData._id,
      conversation: conversation
    })
    setEnableFeedbackNotes(true);
    if (enableCamera) {
      toast.error("Camera turned off due to disconnect");
    }
    setEnableCamera(false);

  };

  /* ---------- UPDATE TOKEN ---------- */
  const updateUserTokenMethod = async (text) => {
    if (!text || !userData?._id) return;

    const tokenCount = text.trim().split(/\s+/).length;
    if (tokenCount === 0) return;

    const newCredits = Number(userData.credits) - tokenCount;

    if (newCredits < 0) {
      toast.error("Insufficient credits");
      return;
    }

    await updateUserToken({
      id: userData._id,
      credits: newCredits,
    });

    setUserData((prev) => ({
      ...prev,
      credits: newCredits,
    }));
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
            <div className="absolute bottom-10 right-10 w-[130px] h-[80px] flex items-center justify-center rounded-2xl border bg-gray-200">
              {enableCamera ? (
                <Webcam
                  audio={false}
                  mirrored
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <UserButton />
              )}
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-2 right-10 cursor-pointer
              transition-all duration-200
              hover:underline
            hover:text-gray-600"
              onClick={() => {
                if (!enableCamera) {
                  toast.success("Camera enabled");
                } else {
                  toast.error("Camera disabled!");
                }
                setEnableCamera(!enableCamera);
              }}
            >
              {enableCamera ? "Disable Camera" : "Enable Camera"}
            </Button>



          </div>
          <div className="mt-5 flex justify-center">
            {!enableMic ? (
              <Button onClick={connectToServer} disabled={connecting} className='cursor-pointer'>
                {connecting && <Loader2Icon className="animate-spin mr-2" />}
                Connect
              </Button>
            ) : (
              <Button variant="destructive" onClick={disconnect} className='cursor-pointer'>
                Disconnect
              </Button>
            )}
          </div>
        </div>
        <ChatBox conversation={conversation} aiLoading={aiLoading} enableFeedbackNotes={enableFeedbackNotes} coachingOption={DiscussionRoomData?.coachingOption} />
      </div>
    </div>
  );
};

export default DiscussionRoom;