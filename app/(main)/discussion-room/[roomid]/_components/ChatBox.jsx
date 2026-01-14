"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { AIModelToGenerateFeedbackAndNotes } from "@/services/GlobalServices";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ChatBox = ({
  conversation = [],
  aiLoading = false,
  coachingOption,
  enableFeedbackNotes = false,
}) => {
  const [loading, setLoading] = useState(false);
  const updateSummery = useMutation(api.DiscussionRoom.UpdateSummery);
  const { roomid } = useParams();

  /* 🔽 AUTO SCROLL REF */
  const bottomRef = useRef(null);

  /* 🔽 AUTO SCROLL EFFECT */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, aiLoading]);

  const GenerateFeedbackNotes = async () => {
    setLoading(true);
    try {
      const result = await AIModelToGenerateFeedbackAndNotes(
        coachingOption,
        conversation
      );

      await updateSummery({
        id: roomid,
        summery: result,
      });

      toast.success("Feedback / Notes Saved!");
    } catch (error) {
      toast.error("Internal server error, try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Chat Container */}
      <div className="h-[60vh] bg-secondary border rounded-4xl p-4 overflow-y-auto flex flex-col">
        {conversation.length === 0 && !aiLoading && (
          <div className="h-full flex items-center justify-center text-gray-500">
            Chat Section
          </div>
        )}

        {conversation.map((m, i) => (
          <div
            key={i}
            className={`mb-2 px-4 py-2 rounded-lg max-w-[80%] break-words ${
              m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            {m.content}
          </div>
        ))}

        {aiLoading && (
          <div className="italic text-gray-500 mt-2">
            Assistant is thinking…
          </div>
        )}

        {/* 🔽 SCROLL TARGET */}
        <div ref={bottomRef} />
      </div>

      {enableFeedbackNotes && (
        <Button
          onClick={GenerateFeedbackNotes}
          disabled={loading}
          className="mt-7 w-full cursor-pointer"
        >
          {loading && <LoaderCircle className="animate-spin mr-2" />}
          Generate Feedback / Notes
        </Button>
      )}
    </div>
  );
};

export default ChatBox;
