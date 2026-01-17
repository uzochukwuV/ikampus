"use client";

import React from "react";
import { Avatar } from "@/ui/components/Avatar";
import { ChatSelect } from "@/ui/components/ChatSelect";
import { ChatSelectItem } from "@/ui/components/ChatSelectItem";
import { DropdownMenu } from "@/ui/components/DropdownMenu";
import { IconButton } from "@/ui/components/IconButton";
import { Switch } from "@/ui/components/Switch";
import { TextFieldUnstyled } from "@/ui/components/TextFieldUnstyled";
import { Tooltip } from "@/ui/components/Tooltip";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherArrowUp } from "@subframe/core";
import { FeatherBook } from "@subframe/core";
import { FeatherCloud } from "@subframe/core";
import { FeatherFilePlus2 } from "@subframe/core";
import { FeatherGlobe } from "@subframe/core";
import { FeatherInfo } from "@subframe/core";
import { FeatherLaptop } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import { FeatherMessageCircle } from "@subframe/core";
import { FeatherPaperclip } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherSparkles } from "@subframe/core";
import { FeatherUserCog2 } from "@subframe/core";
import { FeatherMic } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { MyLayout } from "../ui/custom/MyLayout";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

function ChatGptNewChat2() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now(),
        content:
          "Thanks for your message! I'm Ikampus AI, here to help you with your studies and campus life.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MyLayout>
      <div className="flex h-full w-full flex-col items-start bg-white">
        {/* Top Navigation Bar */}
        <div className="flex w-full items-center justify-between border-b border-neutral-200 px-6 py-3">
          {/* Left side - iKampus logo and name */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <span className="text-[14px] font-semibold text-white">ik</span>
            </div>
            <span className="text-[15px] font-semibold text-neutral-900">
              iKampus
            </span>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center gap-4">
            {/* History/Clock icon */}
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <svg
                className="w-5 h-5 text-neutral-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Message/Chat icon */}
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <FeatherMessageCircle className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-center bg-white px-6 py-8 overflow-auto">
          {messages.length === 0 ? (
            /* Empty State - Centered Greeting */
            <div className="flex w-full max-w-[800px] grow shrink-0 basis-0 flex-col items-center justify-center gap-3 pb-44">
              <h1 className="text-[42px] font-normal text-neutral-900">
                Hello, Llyold
              </h1>
            </div>
          ) : (
            /* Messages Area */
            <div className="flex w-full max-w-[768px] flex-col items-start gap-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar size="small">AI</Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-neutral-100 text-default-font"
                    }`}
                  >
                    <p className="text-body font-body whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar
                      size="small"
                      image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                    >
                      LP
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="flex w-full max-w-[800px] flex-col items-center justify-center gap-4 mt-auto">
            {/* Input Box */}
            <div className="flex w-full flex-col items-start rounded-[24px] bg-neutral-100 shadow-sm">
              <div className="flex w-full items-center gap-3 px-4 py-3">
                {/* Attachment Icon */}
                <button className="flex-shrink-0 p-1 hover:bg-neutral-200 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5 text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  placeholder="Message iKampus AI..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-500 outline-none border-none"
                />

                {/* Voice Icon */}
                <button className="flex-shrink-0 p-1 hover:bg-neutral-200 rounded-lg transition-colors">
                  <FeatherMic className="w-5 h-5 text-neutral-600" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === ""}
                  className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    inputValue.trim() === ""
                      ? "bg-neutral-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FeatherArrowUp
                    className={`w-5 h-5 ${
                      inputValue.trim() === ""
                        ? "text-neutral-500"
                        : "text-white"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MyLayout>
  );
}

export default ChatGptNewChat2;