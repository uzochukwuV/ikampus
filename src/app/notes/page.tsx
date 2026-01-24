"use client";

import React, { useState, useEffect, useRef } from "react";
import { MyLayout } from "@/src/ui/custom/MyLayout";
import { IconButton } from "@/src/ui/components/IconButton";
import { FeatherMic, FeatherSquare, FeatherTrash2, FeatherPlus, FeatherFileText } from "@subframe/core";
import { useNotes } from "@/src/context/NotesContext";

// Define a type for the speech recognition object
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: any) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function NotesPage() {
    const { notes, addNote, deleteNote } = useNotes();
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            if (recognitionRef.current) {
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = "en-US";

                recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                    let interimTranscript = "";
                    let finalTranscript = "";

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    setTranscription(finalTranscript + interimTranscript);
                };

                recognitionRef.current.onend = () => {
                    setIsRecording(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error);
                    setIsRecording(false);
                };
            }
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            if (transcription.trim()) {
                addNote(transcription);
                setTranscription("");
            }
        } else {
            setTranscription("");
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleManualAdd = () => {
        const content = prompt("Enter your note:");
        if (content && content.trim()) {
            addNote(content);
        }
    };

    return (
        <MyLayout>
            <div className="flex flex-col h-full w-full bg-white">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-neutral-100 gap-4 md:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: '"Source Code Variable", monospace' }}>
                            My Notes
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">Record and manage your study notes</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
                        <button
                            onClick={handleManualAdd}
                            className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 bg-neutral-100 font-medium text-neutral-700 hover:bg-neutral-200 rounded-full transition-all text-sm flex-1 sm:flex-initial"
                        >
                            <FeatherPlus className="w-4 h-4" />
                            <span>Text Note</span>
                        </button>
                        <button
                            onClick={toggleRecording}
                            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full font-medium transition-all text-sm flex-1 sm:flex-initial ${isRecording
                                ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                                }`}
                        >
                            {isRecording ? <FeatherSquare className="w-4 h-4" /> : <FeatherMic className="w-4 h-4" />}
                            <span className="hidden sm:inline">{isRecording ? "Stop Recording" : "Record Note"}</span>
                            <span className="sm:hidden">{isRecording ? "Stop" : "Record"}</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 bg-neutral-50/30">
                    <div className="max-w-4xl mx-auto">
                        {/* Recording Feedback */}
                        {isRecording && (
                            <div className="mb-8 p-6 bg-white border border-blue-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Listening...</span>
                                </div>
                                <p className="text-lg text-neutral-800 italic leading-relaxed">
                                    {transcription || "Start speaking to see transcription..."}
                                </p>
                            </div>
                        )}

                        {/* Notes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                            {notes.length === 0 && !isRecording ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                                        <FeatherFileText className="w-8 h-8 text-neutral-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-neutral-900">No notes yet</h3>
                                    <p className="text-neutral-500 mt-2 max-w-xs">
                                        Start recording your first note using the mic button above.
                                    </p>
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="group relative flex flex-col bg-white border border-neutral-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded">
                                                {new Date(note.timestamp).toLocaleDateString([], {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <button
                                                onClick={() => deleteNote(note.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <FeatherTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-neutral-800 leading-relaxed text-[15px]">
                                                {note.content}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center justify-between">
                                            <span className="text-xs text-neutral-400">
                                                {new Date(note.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                                <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                                                <div className="w-1 h-1 bg-blue-400/20 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MyLayout>
    );
}
