import React from "react";

const ChatBox = ({ conversation = [], aiLoading = false }) => {
  return (
    <div>
      {/* Chat Container */}
      <div className="h-[60vh] bg-secondary border rounded-4xl p-4 overflow-y-auto flex flex-col">
        {conversation.length === 0 && !aiLoading && (
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            Chat Section
          </div>
        )}

        {conversation.map((m, i) => (
          <div
            key={i}
            className={`mb-2 px-4 py-2 rounded-lg max-w-[80%] ${
              m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-300"
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
      </div>

      <h2 className="mt-4 text-gray-500 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes from your conversation
          </h2>
    </div>
  );
};

export default ChatBox;
