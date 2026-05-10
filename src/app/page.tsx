"use client";

import { useEffect, useState } from "react";

type FileItem = {
  name: string;
  description: string;
  icon: string;
  iconSize?: string;
  position?: string;
  stack?: string[];
  notes?: string[];
  playUrl?: string;
  screenshots?: string[];
};

const files: FileItem[] = [
  {
    name: "about.txt",
    description:
      "saif alshawaf\n\nsoftware engineering student focused on frontend development, game systems, interactive experiences, and digital aesthetics.\n\ni like to build things\nsee what i've been up to...",
    icon: "/icons/note.png",
    position: "absolute left-100 top-100",
  },
  {
    name: "kittyxcarson.url",
    description: "survival platformer featuring Hello Kitty and lean",
    icon: "/icons/Kitty-Carson-icon.png",
    iconSize: "w-14 h-14",
    stack: ["html", "css", "javascript"],
    playUrl: "https://kittyxcarson.xyz",
    notes: [
      "inspired by analog horror and artist Ken Carson",
      "fight endlessly spawning entities while upgrading health, attack, range, reload speed, and knockback",
      "recently redesigned the browser audio flow around autoplay restrictions and refined enemy spawning/progression systems",
    ],
    screenshots: ["/media/kitty-preview-1.png", "/media/kitty-preview-2.png"],
  },
  {
    name: "soulseek.exe",
    description: "turn based combat pirate game",
    icon: "/icons/folder.png",
    notes: [
      "explore islands, encounter wandering souls, and build a crew through combat and capture systems",
      "procedural/random encounter zones",
      "custom dialogue and battle UI systems",
      "scene transition and island reveal effects"
    ],
    screenshots: ["/media/soul-seek-preview-1.png", "/media/soul-seek-preview-2.png"],
  },
  {
    name: "healthcare.apk",
    description: "react native healthcare interface built through western developer society",
    icon: "/icons/folder.png",
     notes: [
      "implemented bottom navigation architecture",
      "designed calendar and tag-based information views",
      "worked with react navigation and nativewind",
      "contributed to patient and doctor dashboard flows"
    ],
     screenshots: ["/media/healthcare-preview-1.png", "/media/healthcare-preview-2.png"],
  },
];

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [openImages, setOpenImages] = useState< { src: string; top: number; left: number }[] >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBooting(false);

      const aboutFile = files.find((file) => file.name === "about.txt") ?? null;
      setActiveFile(aboutFile);
      setOpenImages([]);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  function openFile(file: FileItem) {
    setActiveFile(file);
    setOpenImages(
    (file.screenshots ?? []).map((src) => ({
      src,
      top: Math.random() * 300 + 80,
      left: Math.random() * 500 + 80,
    }))
  );




  }

  function closeMainWindow() {
    setActiveFile(null);
    setOpenImages([]);
  }

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
    <main className="relative w-screen h-screen bg-black text-white overflow-hidden p-6 font-[family-name:var(--font-geist-mono)]">
      {/* texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.00] bg-[url('/noise.png')]" />

      {/* desktop */}
      <div className="relative z-10 flex flex-col gap-8 w-fit">
        {files.map((file) => (
          <button
            key={file.name}
            onClick={() => openFile(file)}
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

      {/* main artifact window */}
      {activeFile && (
        <div className="absolute z-20 top-24 left-1/2 -translate-x-1/2 w-[600px] border border-white/30 bg-black/90 backdrop-blur-[1px]">
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-white/20 px-3 py-2 text-sm">
            <span>{activeFile.name}</span>

            <button onClick={closeMainWindow} className="hover:opacity-60">
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
                {activeFile.notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            )}

            {activeFile.playUrl && (
              <a
                href={activeFile.playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-white/30 px-3 py-2 text-xs hover:bg-white hover:text-black transition"
              >
                play now
              </a>
            )}
          </div>
        </div>
      )}

      {/* screenshot windows */}
      {openImages.map((image, index) => (
  <div
    key={`${image.src}-${index}`}
    className="absolute z-30 w-[420px] border border-white/30 bg-black/90 backdrop-blur-[1px]"
    style={{
      top: `${image.top}px`,
      left: `${image.left}px`,
    }}
  >
    <div className="flex items-center justify-between border-b border-white/20 px-3 py-2 text-sm">
      <span>{image.src.split("/").pop()}</span>

      <button
        onClick={() =>
          setOpenImages((prev) => prev.filter((_, i) => i !== index))
        }
        className="hover:opacity-60"
      >
        ×
      </button>
    </div>

    <div className="p-2">
      <img
        src={image.src}
        alt="project screenshot"
        className="w-full max-h-[300px] object-contain pixelated"
      />
    </div>
  </div>
))}

      {/* system text */}
      <div className="absolute z-10 bottom-4 right-4 text-xs opacity-30">
        saifarchive.local
      </div>
    </main>
  );
}