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
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState("");

    // MediaRecorder refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());

                handleTranscription(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTranscription(""); // Clear previous transcription
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true); // Start processing state
        }
    };

    const handleTranscription = async (audioBlob: Blob) => {
        try {
            const formData = new FormData();
            formData.append('file', audioBlob);

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Server Error Details:", errorData);
                throw new Error(errorData.details || errorData.error || 'Transcription failed');
            }

            const data = await response.json();
            if (data.text) {
                setTranscription(data.text);
                addNote(data.text);
            }
        } catch (error: any) {
            console.error("Transcription error:", error);
            alert(`Failed to transcribe: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
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
                            disabled={isRecording || isProcessing}
                            className="flex items-center justify-center md:justify-start gap-2 px-4 py-2 bg-neutral-100 font-medium text-neutral-700 hover:bg-neutral-200 rounded-full transition-all text-sm flex-1 sm:flex-initial disabled:opacity-50"
                        >
                            <FeatherPlus className="w-4 h-4" />
                            <span>Text Note</span>
                        </button>
                        <button
                            onClick={toggleRecording}
                            disabled={isProcessing}
                            className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full font-medium transition-all text-sm flex-1 sm:flex-initial ${isRecording
                                ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                                : isProcessing
                                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                                }`}
                        >
                            {isRecording ? <FeatherSquare className="w-4 h-4" /> : <FeatherMic className="w-4 h-4" />}
                            <span className="hidden sm:inline">
                                {isRecording ? "Stop Recording" : isProcessing ? "Processing..." : "Record Note"}
                            </span>
                            <span className="sm:hidden">
                                {isRecording ? "Stop" : isProcessing ? "..." : "Record"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 md:p-8 bg-neutral-50/30">
                    <div className="max-w-4xl mx-auto">
                        {/* Recording/Processing Feedback */}
                        {(isRecording || isProcessing) && (
                            <div className="mb-8 p-6 bg-white border border-blue-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-3 mb-3">
                                    {isRecording ? (
                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                                    ) : (
                                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                        {isRecording ? "Listening..." : "Transcribing..."}
                                    </span>
                                </div>
                                <p className="text-lg text-neutral-800 italic leading-relaxed">
                                    {isRecording
                                        ? "Speak clearly. Click Stop when finished."
                                        : "Generating precise transcription with AI..."}
                                </p>
                            </div>
                        )}

                        {/* Notes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                            {notes.length === 0 && !isRecording && !isProcessing ? (
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
