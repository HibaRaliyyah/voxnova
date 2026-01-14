
export const AIModel = async (topic, coachingOption, lastTwoConversation) => {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic,
      coachingOption,
      lastTwoConversation,
    }),
  });

  if (!res.ok) {
    throw new Error("AI rate limited");
  }

  const data = await res.json();
  return data.reply;
};

export const ConvertTextToSpeech = async (text, expertName) => {
  const res = await fetch("/api/text-to-speech", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice: expertName }),
  });

  const arrayBuffer = await res.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });

  return URL.createObjectURL(blob);
};

export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation) => {
  const res = await fetch("/api/aiFeedbackAndNotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coachingOption,
      conversation,
    }),
  });

  if (!res.ok) {
    throw new Error("AI rate limited");
  }

  const data = await res.json();
  return data.reply;
};