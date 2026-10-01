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
  link?: { label: string; href: string };
  external?: string;
  screenshots?: string[];
};

// layout constants — keep these in sync with the window classes below
const MOBILE_BREAKPOINT = 900;
const MAIN_WINDOW_WIDTH = 420;
const IMAGE_WINDOW_WIDTH = 420;
const EDGE_GAP = 24;

const files: FileItem[] = [
  {
    name: "about.txt",
    description:
      "saif alshawaf\n\nsoftware engineering student focused on frontend development, game systems, interactive experiences, and digital aesthetics.\n\ni like to build things",
    icon: "/icons/note.png",
    position: "lg:absolute lg:left-340 lg:top-100",
  },

  // flagship projects (custom logo icons)
  {
    name: "kittyxcarson.url",
    description: "survival platformer featuring Hello Kitty and lean",
    icon: "/icons/Kitty-Carson-icon.png",
    iconSize: "w-14 h-14",
    stack: ["html", "css", "javascript"],
    link: { label: "play now", href: "https://kittyxcarson.xyz" },
    notes: [
      "inspired by analog horror and artist Ken Carson",
      "fight endlessly spawning entities while upgrading health, attack, range, reload speed, and knockback",
      "recently redesigned the browser audio flow around autoplay restrictions and refined enemy spawning/progression systems",
    ],
    screenshots: ["/media/kitty-preview-1.png", "/media/kitty-preview-2.png"],
  },
  {
    name: "timbi.url",
    description: "campus free-food finder for western students\n\nsolo build",
    icon: "/icons/timbi.png", 
    iconSize: "w-14 h-14",
    stack: ["next.js", "supabase", "clerk", "leaflet", "tailwind"],
    link: { label: "open site", href: "https://timbi.app" }, 
    notes: [
      "openai pulls free-food posts from club instagrams",
      "redesigned from a carousel into a split list/map view",
      "tracked down a floating-point bug in leaflet's flyTo",
    ],
    screenshots: ["/media/timbi-preview-1.png", "/media/timbi-preview-2.png"], 
  },
  {
    name: "faybl.apk",
    description:
      "story-driven audio running app\n\nfrontend dev alongside the founders",
    icon: "/icons/faybl.png",
    iconSize: "w-14 h-14",
    stack: ["react", "tailwind"],
    notes: [
      "designed app onboarding system: accent colours and motifs over a shared layout skeleton",
      "redesigned the home and profile screen implementing a bookshelf concept",
    ],
  },

  // smaller projects (shared folder sprite)
  {
    name: "soulseek.exe",
    description: "turn based combat pirate game",
    icon: "/icons/folder.png",
    stack: ["unity", "c#", "piskel"],
    notes: [
      "explore islands, encounter wandering souls, and build a crew through combat and capture systems",
      "procedural/random encounter zones",
      "custom dialogue and battle UI systems",
      "scene transition and island reveal effects",
    ],
    screenshots: [
      "/media/soul-seek-preview-1.png",
      "/media/soul-seek-preview-2.png",
      "/media/soul-seek-preview-3.png",
    ],
  },
  {
    name: "healthcare.apk",
    description:
      "react native healthcare interface built through western developer society",
    icon: "/icons/folder.png",
    stack: ["react native", "typescript", "expo", "nativewind"],
    notes: [
      "implemented bottom navigation architecture",
      "designed calendar and tag-based information views",
      "worked with react navigation and nativewind",
      "contributed to patient and doctor dashboard flows",
    ],
    screenshots: [
      "/media/healthcare-preview-1.png",
      "/media/healthcare-preview-2.png",
    ],
  },

  // links
  {
    name: "github.url",
    description: "",
    icon: "/icons/git.png",
    iconSize: "w-12 h-12",
    external: "https://github.com/saifnot-safe",
    position: "lg:absolute lg:left-265 lg:top-40",
  },
  {
    name: "linkedin.url",
    description: "",
    icon: "/icons/linkedin.png",
    iconSize: "w-12 h-12",
    external: "https://linkedin.com/in/saif-alshawaf",
    position: "lg:absolute lg:left-230 lg:top-60",
  },
];

// reads the viewport directly — safe to call inside timeouts and event handlers
function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

// random spot that keeps a window of `width` fully on screen
function randomLeft(width: number, minLeft: number) {
  const maxLeft = Math.max(minLeft, window.innerWidth - width - EDGE_GAP);
  return minLeft + Math.random() * (maxLeft - minLeft);
}

function randomTop(minTop: number, range: number) {
  return minTop + Math.random() * range;
}

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  const [openImages, setOpenImages] = useState<
    { src: string; top: number; left: number }[]
  >([]);
  const [windowPosition, setWindowPosition] = useState({ top: 120, left: 400 });

  // keep isMobile in sync with the viewport so layout updates on resize
  useEffect(() => {
    const update = () => setIsMobile(isMobileViewport());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // boot screen, then open about.txt
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const mobile = isMobileViewport();
      setWindowPosition({
        top: mobile ? 20 : 120,
        left: mobile ? 16 : Math.min(420, randomLeft(MAIN_WINDOW_WIDTH, 200)),
      });
      setActiveFile(files.find((file) => file.name === "about.txt") ?? null);
      setOpenImages([]);
      setBooting(false);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, []);

  function openFile(file: FileItem) {
    if (file.external) {
      window.open(file.external, "_blank", "noopener,noreferrer");
      return;
    }

    const mobile = isMobileViewport();

    setWindowPosition({
      top: mobile ? 100 : randomTop(80, 200),
      left: mobile ? 16 : randomLeft(MAIN_WINDOW_WIDTH, 200),
    });

    setActiveFile(file);

    setOpenImages(
      (file.screenshots ?? []).map((src, index) => ({
        src,
        top: mobile ? 140 + index * 24 : randomTop(80, 300),
        left: mobile ? 16 : randomLeft(IMAGE_WINDOW_WIDTH, 80),
      }))
    );
  }

  function closeMainWindow() {
    setActiveFile(null);
  }

  function closeImage(index: number) {
    setOpenImages((prev) => prev.filter((_, i) => i !== index));
  }

  if (booting) {
    return (
      <main className="w-screen h-screen bg-black text-white flex items-center justify-center font-[family-name:var(--font-geist-mono)]">
        <div className="text-center text-sm tracking-wide">
          <div className="mb-4 text-lg">SAIF ARCHIVE</div>
          <div className="typewriter opacity-60 mx-auto">loading artifacts...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen min-h-screen overflow-hidden bg-black text-white p-6 font-[family-name:var(--font-geist-mono)]">
      {/* texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.00] bg-[url('/noise.png')]" />

      {/* desktop */}
      <div className="relative z-10 flex flex-wrap gap-8 w-fit lg:flex-col">
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
            <div className="text-xs text-center leading-tight">{file.name}</div>
          </button>
        ))}
      </div>

      {/* main artifact window */}
      {activeFile && (
        <div
          className={`${
            isMobile ? "relative -mt-[75px]" : "absolute"
          } z-20 w-[92vw] max-w-[420px] border border-white/30 bg-black/90 backdrop-blur-[1px]`}
          style={
            isMobile
              ? {}
              : { top: `${windowPosition.top}px`, left: `${windowPosition.left}px` }
          }
        >
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-white/20 px-3 py-2 text-sm">
            <span>{activeFile.name}</span>
            <button onClick={closeMainWindow} className="hover:opacity-60">
              ×
            </button>
          </div>

          {/* content */}
          <div className="p-3 landscape:p-2 md:p-4">
            <p className="text-xs md:text-sm opacity-60 mb-3 landscape:mb-2 whitespace-pre-line">
              {activeFile.description}
            </p>

            {activeFile.stack && (
              <div className="mb-4 text-xs opacity-50">
                {activeFile.stack.join(" / ")}
              </div>
            )}

            {activeFile.notes && (
              <ul className="text-xs md:text-sm opacity-60 space-y-1 md:space-y-2 mb-3 landscape:mb-2">
                {activeFile.notes.map((note) => (
                  <li key={note}>- {note}</li>
                ))}
              </ul>
            )}

            {activeFile.link && (
              <a
                href={activeFile.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-white/30 px-3 py-2 text-xs hover:bg-white hover:text-black transition"
              >
                {activeFile.link.label}
              </a>
            )}
          </div>
        </div>
      )}

      {/* screenshot windows */}
      {openImages.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={`${
            isMobile ? "relative mt-3" : "absolute"
          } z-30 w-[92vw] max-w-[520px] md:w-[420px] border border-white/30 bg-black/90 backdrop-blur-[1px]`}
          style={
            isMobile ? {} : { top: `${image.top}px`, left: `${image.left}px` }
          }
        >
          <div className="flex items-center justify-between border-b border-white/20 px-3 py-2 text-sm">
            <span>{image.src.split("/").pop()}</span>
            <button onClick={() => closeImage(index)} className="hover:opacity-60">
              ×
            </button>
          </div>

          <div className="p-2">
            <img
              src={image.src}
              alt="project screenshot"
              className="w-full max-h-[240px] object-contain pixelated"
            />
          </div>
        </div>
      ))}

      {/* system text */}
      <div className="absolute z-10 bottom-4 right-4 text-xs opacity-30">
        saifarchive.xyz
      </div>
    </main>
  );
}