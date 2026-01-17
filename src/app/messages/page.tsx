"use client";

import React, { useState } from "react";
import { MyLayout } from "@/ui/custom/MyLayout";
import { Avatar } from "@/ui/components/Avatar";
import { FeatherArrowLeft, FeatherMic, FeatherSearch } from "@subframe/core";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: number;
  content: string;
  role: "user" | "other";
  timestamp: string;
}

interface ChatUser {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar?: string;
  hasUnread?: boolean;
}

const MOCK_CHATS: ChatUser[] = [
  {
    id: 1,
    name: "A ❤️",
    lastMessage: "Im doing exam",
    lastMessageTime: "15:37",
    hasUnread: false,
  },
  {
    id: 2,
    name: "+44 7564 043888",
    lastMessage: "Hi Lloyd, do you have any updates for me please I need to report to your landlord t...",
    lastMessageTime: "13:49",
    hasUnread: false,
  },
  {
    id: 3,
    name: "+44 7908 684562",
    lastMessage: "Smile White: Reply YES to move your online consultation to WhatsApp chat. N...",
    lastMessageTime: "10:57",
    hasUnread: true,
  },
  {
    id: 4,
    name: "Chika, Sabo, Chisom Uk...",
    lastMessage: "Hi Lads, Kate and Jack the plumber will be round tomorrow morning to look at room...",
    lastMessageTime: "Tuesday",
    hasUnread: false,
  },
  {
    id: 5,
    name: "Wisdom",
    lastMessage: "Started Sharing Location",
    lastMessageTime: "Tuesday",
    hasUnread: false,
  },
  {
    id: 6,
    name: "JS",
    lastMessage: "ur asking man for loud who told u i shot",
    lastMessageTime: "Tuesday",
    hasUnread: true,
  },
  {
    id: 7,
    name: "NPN",
    lastMessage: "BACK OUTSIDE NN1 - NORTHAMPTON BIGGEST START OF THE YEAR PARTY...",
    lastMessageTime: "Monday",
    hasUnread: true,
  },
  {
    id: 8,
    name: "Work Chi",
    lastMessage: "Ok",
    lastMessageTime: "Monday",
    hasUnread: false,
  },
];

const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    content: "Hey Lloyd, how are you doing?",
    role: "other",
    timestamp: "10:30",
  },
  {
    id: 2,
    content: "I'm doing great! How about you?",
    role: "user",
    timestamp: "10:32",
  },
  {
    id: 3,
    content: "All good here, just wanted to check in",
    role: "other",
    timestamp: "10:35",
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(MOCK_CHATS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);

  const filteredChats = MOCK_CHATS.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      content: inputValue,
      role: "user",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MyLayout>
      <div className="flex h-full w-full bg-white">
        {/* Messages List - Always visible on mobile, left side on desktop */}
        <div
          className={`flex flex-col border-r border-neutral-200 bg-white ${
            selectedChat ? "hidden lg:flex lg:w-80" : "w-full"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-neutral-900">Messages</h1>
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
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-neutral-100 rounded-full px-4 py-2">
              <FeatherSearch className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none border-none"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`flex w-full items-start gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors ${
                  selectedChat?.id === chat.id
                    ? "bg-neutral-50"
                    : "hover:bg-neutral-50"
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-neutral-400 flex items-center justify-center text-white font-semibold">
                  {chat.name.charAt(0)}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold text-neutral-900 truncate ${
                        chat.hasUnread ? "font-bold" : ""
                      }`}
                    >
                      {chat.name}
                    </h3>
                    <span className="text-xs text-neutral-500 flex-shrink-0">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 truncate mt-1">
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Unread indicator */}
                {chat.hasUnread && (
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Pane - Hidden on mobile when list is shown, visible on desktop */}
        {selectedChat && (
          <div className="flex-1 flex flex-col h-full bg-white">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 bg-white">
              <div className="flex items-center gap-3">
                {/* Back button on mobile */}
                <button
                  onClick={() => setSelectedChat(null)}
                  className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <FeatherArrowLeft className="w-5 h-5 text-neutral-600" />
                </button>
                <div>
                  <h2 className="font-semibold text-neutral-900">
                    {selectedChat.name}
                  </h2>
                </div>
              </div>

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
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-neutral-500"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-neutral-200 p-4 bg-white">
              <div className="flex items-center gap-3 bg-neutral-100 rounded-full px-4 py-3">
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

                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 outline-none border-none"
                />

                <button className="flex-shrink-0 p-1 hover:bg-neutral-200 rounded-lg transition-colors">
                  <FeatherMic className="w-5 h-5 text-neutral-600" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === ""}
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    inputValue.trim() === ""
                      ? "bg-neutral-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      inputValue.trim() === ""
                        ? "text-neutral-500"
                        : "text-white"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State for Desktop */}
        {!selectedChat && (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-neutral-50">
            <p className="text-neutral-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </MyLayout>
  );
}
