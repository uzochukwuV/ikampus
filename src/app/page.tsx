"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Image from "next/image";
import ikampusLogo from "../assets/images/ikampus_white.png";

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

function ChatGptNewChat2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reset messages when "new" parameter is in URL
  React.useEffect(() => {
    const isNewChat = searchParams.get("new") === "true";
    if (isNewChat) {
      setMessages([]);
      setInputValue("");
      // Remove the query parameter from URL
      router.replace("/");
    }
  }, [searchParams, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;

    const newMessage: Message = {
      id: Date.now(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Get AI response from Groq API
    try {
      // Include recent conversation history for context
      const conversationHistory = [...messages, newMessage].slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const aiResponse: Message = {
        id: Date.now(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: Date.now(),
        content:
          "Sorry, I encountered an error. Please make sure the API key is configured correctly.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
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
        <div className="flex w-full items-center justify-between border-b border-neutral-100 px-6 py-3 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
          {/* Left side - iKampus logo and name */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden bg-neutral-900 shadow-lg apple-spring">
              <Image
                src={ikampusLogo}
                alt="iKampus Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[16px] font-semibold text-neutral-900 tracking-tight">
              iKampus
            </span>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center gap-2">
            {/* History/Clock icon */}
            <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-all duration-200 apple-spring apple-focus">
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
            <button
              onClick={() => router.push("/messages")}
              className="p-2.5 hover:bg-neutral-100 rounded-xl transition-all duration-200 apple-spring apple-focus"
            >
              <FeatherMessageCircle className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-center justify-center bg-white px-6 py-8 overflow-auto">
          {messages.length === 0 ? (
            /* Empty State - Centered Greeting */
            <div className="flex w-full max-w-[800px] grow shrink-0 basis-0 flex-col items-center justify-center gap-3 pb-34">
              <h1 className="text-[52px] text-neutral-900 animate-fade-in">
                Hello, Lloyd
              </h1>
              <p className="text-neutral-500 text-lg animate-fade-in-delay">
                How can I help you today?
              </p>
            </div>
          ) : (
            /* Messages Area */
            <div className="flex w-full max-w-[768px] flex-col items-start gap-4 py-4 apple-scroll">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex w-full gap-3 animate-message-in ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shadow-md">
                      <FeatherSparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${message.role === "user"
                      ? "bg-neutral-800 text-white rounded-br-md"
                      : "bg-neutral-100 text-neutral-800 rounded-bl-md"
                      }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <span className={`text-[11px] mt-1 block ${message.role === "user" ? "text-neutral-400" : "text-neutral-400"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {message.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden shadow-lg ring-2 ring-white">
                      <img
                        src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex w-full gap-3 justify-start animate-fade-in">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shadow-md">
                    <FeatherSparkles className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="bg-neutral-100 rounded-2xl rounded-bl-md shadow-sm">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="flex w-full max-w-[800px] flex-col items-center justify-center gap-4 mt-auto pb-4">
            {/* Quick action chips */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 justify-center animate-fade-in-delay">
                {['Help me study', 'Explain a concept', 'Write an essay', 'Practice questions'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="px-4 py-2 rounded-full text-sm text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 apple-spring"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className="chat-input-wrapper flex w-full flex-col items-start rounded-[28px] bg-white border border-neutral-200 shadow-sm hover:shadow-md">
              <div className="flex w-full items-center gap-3 px-4 py-3">
                {/* Attachment Icon */}
                <button className="flex-shrink-0 p-2 hover:bg-neutral-100 rounded-xl transition-all duration-200 apple-spring apple-focus">
                  <svg
                    className="w-5 h-5 text-neutral-500"
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
                  ref={inputRef}
                  type="text"
                  placeholder="Message iKampus AI..."
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none border-none disabled:opacity-50"
                />

                {/* Voice Icon */}
                <button
                  className="flex-shrink-0 p-2 hover:bg-neutral-100 rounded-xl transition-all duration-200 apple-spring apple-focus"
                  disabled={isLoading}
                >
                  <FeatherMic className="w-5 h-5 text-neutral-500" />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === "" || isLoading}
                  className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 apple-spring ${
                    inputValue.trim() === "" || isLoading
                      ? "bg-neutral-200 cursor-not-allowed"
                      : "bg-neutral-800 hover:bg-neutral-700 shadow-md hover:shadow-lg"
                    }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FeatherArrowUp
                      className={`w-5 h-5 transition-transform ${
                        inputValue.trim() === ""
                          ? "text-neutral-400"
                          : "text-white"
                        }`}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Footer text */}
            <p className="text-xs text-neutral-400 text-center">
              iKampus AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </MyLayout>
  );
}

function ChatGptNewChatWrapper() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <ChatGptNewChat2 />
    </Suspense>
  );
}

export default ChatGptNewChatWrapper;

