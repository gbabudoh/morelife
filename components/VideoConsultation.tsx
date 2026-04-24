"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";

interface VideoConsultationProps {
  room: string;
  username: string;
  onLeave: () => void;
}

export default function VideoConsultation({ room, username, onLeave }: VideoConsultationProps) {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit/token?room=${room}&username=${username}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [room, username]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-900 rounded-[2.5rem] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p className="font-bold tracking-tight">Initializing Encrypted Video Room...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-800">
      {/* MoreLife Branding Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <Image src="/logo.png" alt="MoreLife" width={100} height={32} className="h-8 w-auto object-contain" unoptimized />
          </div>
          <div>
            <h3 className="text-white font-black tracking-tight text-lg leading-none">MoreLife Telehealth</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Secure Encrypted Link</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onLeave}
        className="absolute top-6 right-6 z-50 p-3 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl transition-all active:scale-95 border border-red-500/20 pointer-events-auto"
      >
        <X size={20} />
      </button>

      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        onDisconnected={onLeave}
        data-lk-theme="default"
        style={{ height: '100%' }}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
