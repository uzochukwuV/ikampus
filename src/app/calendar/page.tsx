"use client";

import React, { useState, useEffect } from "react";
import { MyLayout } from "@/ui/custom/MyLayout";
import {
    FeatherChevronLeft,
    FeatherChevronRight,
    FeatherPlus,
    FeatherClock,
    FeatherMapPin,
    FeatherX,
    FeatherCalendar
} from "@subframe/core";
import Image from "next/image";
import ikampusLogo from "../../assets/images/ikampus_white.png";

interface Event {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    location?: string;
    date: string; // YYYY-MM-DD
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        startTime: "12:00",
        endTime: "13:00",
        location: "",
    });

    // Load events from localStorage on mount
    useEffect(() => {
        const savedEvents = localStorage.getItem("ikampus-calendar-events");
        if (savedEvents) {
            setEvents(JSON.parse(savedEvents));
        }
    }, []);

    // Save events to localStorage when they change
    useEffect(() => {
        localStorage.setItem("ikampus-calendar-events", JSON.stringify(events));
    }, [events]);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const selectedDateString = formatDate(selectedDate);
    const todaysEvents = events.filter((e) => e.date === selectedDateString).sort((a, b) => a.startTime.localeCompare(b.startTime));

    const handleAddEvent = () => {
        if (!newEvent.title) return;
        const event: Event = {
            id: Date.now().toString(),
            ...newEvent,
            date: selectedDateString,
        };
        setEvents([...events, event]);
        setIsModalOpen(false);
        setNewEvent({ title: "", startTime: "12:00", endTime: "13:00", location: "" });
    };

    const deleteEvent = (id: string) => {
        setEvents(events.filter((e) => e.id !== id));
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <MyLayout>
            <div className="flex flex-col w-full h-full bg-slate-50 overflow-auto lg:overflow-hidden">
                {/* Header - iOS Style */}
                <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image src={ikampusLogo} alt="Logo" width={32} height={32} />
                        </div>
                        <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">Calendar</h1>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 lg:p-1">
                            <button onClick={handlePrevMonth} className="p-1 lg:p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all">
                                <FeatherChevronLeft className="w-4 h-4 text-slate-600" />
                            </button>
                            <span className="px-2 lg:px-3 text-xs lg:text-sm font-semibold text-slate-700 min-w-[100px] lg:min-w-[120px] text-center">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </span>
                            <button onClick={handleNextMonth} className="p-1 lg:p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all">
                                <FeatherChevronRight className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <FeatherPlus className="w-4 h-4 lg:w-5 lg:h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 p-4 lg:p-6 gap-4 lg:gap-6 lg:overflow-hidden">
                    {/* Calendar Grid */}
                    <div className="flex-[2] bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-slate-200 p-4 lg:p-6">
                        <div className="grid grid-cols-7 mb-4">
                            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
                                <div key={day} className="text-center text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-widest pb-2 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-y-1 lg:gap-y-2">
                            {Array.from({ length: firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}
                            {Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                                const day = i + 1;
                                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                                const dateString = formatDate(date);
                                const isSelected = selectedDateString === dateString;
                                const isToday = formatDate(new Date()) === dateString;
                                const hasEvents = events.some(e => e.date === dateString);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(date)}
                                        className={`relative aspect-square flex flex-col items-center justify-center rounded-xl lg:rounded-2xl transition-all ${isSelected ? "bg-blue-600 text-white shadow-md shadow-blue-100 scale-105 z-10" : "hover:bg-slate-50 text-slate-700"
                                            }`}
                                    >
                                        <span className={`text-sm lg:text-base font-semibold ${isToday && !isSelected ? "text-blue-600" : ""}`}>
                                            {day}
                                        </span>
                                        {hasEvents && (
                                            <div className={`mt-0.5 lg:mt-1 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-blue-600"}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Events List for Selected Day */}
                    <div className="flex-1 flex flex-col bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-slate-200 lg:overflow-hidden min-h-[300px]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900">
                                {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                            </h2>
                            <span className="text-xs font-medium text-slate-500 bg-slate-200/50 px-2 py-1 rounded-full">
                                {todaysEvents.length} {todaysEvents.length === 1 ? 'event' : 'events'}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {todaysEvents.length > 0 ? (
                                todaysEvents.map((event) => (
                                    <div key={event.id} className="group relative bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-blue-50/30 hover:border-blue-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{event.title}</h3>
                                            <button
                                                onClick={() => deleteEvent(event.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-md transition-all"
                                            >
                                                <FeatherX className="w-3 h-3 text-red-500" />
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                <FeatherClock className="w-3 h-3" />
                                                <span>{event.startTime} - {event.endTime}</span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                    <FeatherMapPin className="w-3 h-3" />
                                                    <span>{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                                        <FeatherCalendar className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-500">No plans yet</h3>
                                    <p className="text-xs text-slate-400 mt-1">Tap the + button to start planning your day.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add Event Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">New Plan</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <FeatherX className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">What&apos;s the plan?</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Digital Marketing Workshop"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Starts</label>
                                        <input
                                            type="time"
                                            value={newEvent.startTime}
                                            onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Ends</label>
                                        <input
                                            type="time"
                                            value={newEvent.endTime}
                                            onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Where?</label>
                                    <input
                                        type="text"
                                        placeholder="Add location"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="pt-2 text-xs text-slate-400 text-center">
                                    This plan will be added for {selectedDate.toDateString()}
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 flex gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddEvent}
                                    disabled={!newEvent.title}
                                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100 transition-all"
                                >
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MyLayout>
    );
}
