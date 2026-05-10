"use client";

import { useEffect, useState,} from "react";

const files = [
  {
  name: "about.txt",
  description:
    "saif alshawaf\n\nsoftware engineering student focused on frontend development, game systems, interactive experiences, and digital aesthetics.\n\ni like to build things\nsee what i've been up to...",
  icon: "/icons/note.png",
  position: "absolute right-100 bottom-40",
  },
  {
    name: "kittyxcarson.url",
    description: "platformer survival web game",
     icon: "/icons/Kitty-Carson-icon.png",
     iconSize: "w-14 h-14",
     stack: ["html", "css", "javascript"],

     playUrl: "https://kittyxcarson.xyz",

     notes: [
      "platformer survival game with analog horror enemies",
      "redesigned browser audio flow around autoplay restrictions",
      "refined enemy spawning and progression balancing",
    ],
  },
  {
    name: "soulseek.exe",
    description: "turn based soul combat prototype",
     icon: "/icons/folder.png",
  },
  {
    name: "healthcare.apk",
    description: "react native healthcare interface",
     icon: "/icons/folder.png",
  },
  
];


export default function Home() {
  const [booting, setBooting] = useState(true);
  const [activeFile, setActiveFile] = useState<any>(null);

  useEffect(() => {
  const timer = setTimeout(() => {
    setBooting(false);
    setActiveFile(files.find((file) => file.name === "about.txt"));
  }, 3200);

  return () => clearTimeout(timer);
  }, []);

  if (booting) {
  return (
    <main className="w-screen h-screen bg-black text-white flex items-center justify-center font-[family-name:var(--font-geist-mono)]">
      <div className="text-center text-sm tracking-wide">
        <div className="mb-4 text-lg">SAIF ARCHIVE</div>
        <div className="typewriter opacity-60 mx-auto">
        loading artifacts...
        </div>
      </div>
    </main>
  );
  }

  return (
    <main className="w-screen h-screen bg-black text-white overflow-hidden p-6 font-[family-name:var(--font-geist-mono)]">
      {/* desktop */}
      <div className="flex flex-col gap-8 w-fit">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file)}
           className={`${file.position ?? ""} text-left hover:translate-x-[2px] transition w-24 flex flex-col items-center`}
          >
            <img
             src={file.icon}
             alt={file.name}
             className={`${file.iconSize ?? "w-10 h-10"} mb-1 object-contain pixelated`}
            />

            <div className="text-xs text-center leading-tight">
            {file.name}
            </div>
          </button>
        ))}
      </div>

      
      {/* window */}
      {activeFile && (
     <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] border border-white/30 bg-black/90 backdrop-blur-[1px]">
     {/* top bar */}
     <div className="flex items-center justify-between border-b border-white/20 px-3 py-2 text-sm">
    <span>{activeFile.name}</span>

      <button
        onClick={() => setActiveFile(null)}
        className="hover:opacity-60"
      >
        ×
      </button>
    </div>

    {/* content */}
<div className="p-4">

  <p className="text-sm opacity-60 mb-4 whitespace-pre-line">
    {activeFile.description}
  </p>

  {activeFile.stack && (
    <div className="mb-4 text-xs opacity-50">
      {activeFile.stack.join(" / ")}
    </div>
  )}

  {activeFile.notes && (
    <ul className="text-sm opacity-60 space-y-2 mb-4">
      {activeFile.notes.map((note: string) => (
        <li key={note}>- {note}</li>
      ))}
    </ul>
  )}

  {activeFile.playUrl && (
    <a
      href={activeFile.playUrl}
      target="_blank"
      className="text-xs underline opacity-70 hover:opacity-100"
    >
      play now
    </a>
  )}

</div>
</div>
)}
  
    
    
    {/* system text */}
  <div className="absolute bottom-4 right-4 text-xs opacity-30">
    saifarchive.local
  </div>

  {/* texture */}
  <div className="absolute inset-0 pointer-events-none opacity-[0.00] bg-[url('/noise.png')]"></div>

    </main>
  );
}