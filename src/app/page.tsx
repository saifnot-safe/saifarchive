"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

type FileProps = { type: string; role: string; status: string };

type FileItem = {
  name: string;
  /** one-liner for the status bar and the icon's title attribute */
  tagline: string;
  description: string;
  /** file-properties header shown at the top of project windows */
  props?: FileProps;
  icon: string;
  iconSize?: string;
  /** desktop-only placement for icons that sit out on the desktop, as % of the viewport */
  desk?: { right: string; top: string };
  status?: string[];
  stack?: string[];
  notes?: string[];
  jump?: string[];
  links?: { label: string; href: string }[];
  external?: string;
  screenshots?: string[];
  /** screenshots are pixel art, so scale them with hard edges instead of smoothing */
  pixelArt?: boolean;
};

type Win = {
  id: string;
  kind: "file" | "image";
  title: string;
  file?: FileItem;
  src?: string;
  pixelArt?: boolean;
  expanded?: boolean;
  /** which open this window came from; part of its key so a reopen replays the reveal */
  gen: number;
  x: number;
  y: number;
  z: number;
};

// layout constants
const MOBILE_BREAKPOINT = 900;
const MAIN_WINDOW_WIDTH = 420;
const IMAGE_WINDOW_WIDTH = 420;
const EDGE_GAP = 24;
const BOOT_MS = 1500;
const BOOT_REDUCED_MS = 400;
const BOOT_KEY = "saifarchive:booted";

const files: FileItem[] = [
  {
    name: "about.txt",
    tagline: "who i am and what i'm looking for",
    description:
      "saif alshawaf\n\nsoftware engineering student at western, focused on frontend development, game systems, interactive experiences, and digital aesthetics.\n\ni like to build things",
    icon: "/icons/note.png",
    desk: { right: "5%", top: "66%" },
    status: [
      "now: founding team engineer at faybl",
      "looking for: a 12–16 month software internship from may 2027",
    ],
    jump: ["timbi.url", "faybl.apk", "kittyxcarson.url"],
    links: [
      { label: "resume.pdf", href: "/resume.pdf" },
      { label: "email", href: "mailto:saifalshawaf8@gmail.com" },
    ],
  },

  // flagship projects (custom logo icons)
  {
    name: "kittyxcarson.url",
    tagline: "survival platformer you can play in the browser",
    description: "survival platformer featuring Hello Kitty and lean",
    props: { type: "browser game", role: "solo build", status: "live" },
    icon: "/icons/Kitty-Carson-icon.png",
    iconSize: "w-14 h-14",
    stack: ["html", "css", "javascript", "phaser"],
    links: [{ label: "play now", href: "https://kittyxcarson.xyz" }],
    notes: [
      "inspired by analog horror and artist Ken Carson",
      "fight endlessly spawning entities while upgrading health, attack, range, reload speed, and knockback",
      "recently redesigned the browser audio flow around autoplay restrictions and refined enemy spawning/progression systems",
    ],
    screenshots: ["/media/kitty-preview-1.png", "/media/kitty-preview-2.png"],
    pixelArt: true,
  },
  {
    name: "timbi.url",
    tagline: "campus free-food finder for western students",
    description: "campus free-food finder for western students",
    props: { type: "web app", role: "solo build", status: "live" },
    icon: "/icons/timbi.png",
    iconSize: "w-14 h-14",
    stack: ["next.js", "typescript", "supabase", "clerk", "leaflet", "tailwind", "github actions"],
    links: [{ label: "open site", href: "https://timbi.app" }],
    notes: [
      "two scrapers on github actions (playwright for club instagrams, node for western’s events feed) with deduping and run-health checks in postgres",
      "openai pulls free-food details out of the posts it finds",
      "submissions pass rate limits, a gibberish filter, and ai content checks before going live",
      "redesigned from a carousel into a split list/map view",
      "tracked down a floating-point bug in leaflet’s flyTo",
    ],
    screenshots: ["/media/timbi-preview-1.png", "/media/timbi-preview-2.png"],
  },
  {
    name: "faybl.apk",
    tagline: "story-driven audio running app",
    description: "story-driven audio running app\n\nfounding team engineer, building alongside the founders",
    props: { type: "mobile app", role: "founding team", status: "beta" },
    icon: "/icons/faybl.png",
    iconSize: "w-14 h-14",
    stack: ["react native", "expo", "typescript", "supabase", "mapbox"],
    notes: [
      "the story only advances while you’re actually moving",
      "built run route mapping with mapbox and a hand-drawn svg run-history chart",
      "redesigned the home and profile screens around a bookshelf concept",
      "designed the onboarding system: accent colours and motifs over a shared layout skeleton",
      "ships through pr review with the cofounders on a linear workflow",
    ],
  },

  // smaller projects (shared folder sprite)
  {
    name: "soulseek.exe",
    tagline: "turn-based pirate combat game in unity",
    description: "turn based combat pirate game",
    props: { type: "unity game", role: "solo build", status: "prototype" },
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
    pixelArt: true,
  },
  {
    name: "healthcare.apk",
    tagline: "patient and doctor app for western developer society",
    description: "react native healthcare interface built through western developer society",
    props: { type: "mobile app", role: "team project", status: "complete" },
    icon: "/icons/folder.png",
    stack: ["react native", "typescript", "expo", "nativewind"],
    notes: [
      "implemented bottom navigation architecture",
      "designed calendar and tag-based information views",
      "worked with react navigation and nativewind",
      "contributed to patient and doctor dashboard flows",
    ],
    screenshots: ["/media/healthcare-preview-1.png", "/media/healthcare-preview-2.png"],
  },

  // links
  {
    name: "resume.pdf",
    tagline: "opens my resume in a new tab",
    description: "",
    icon: "/icons/resume.png",
    iconSize: "w-12 h-12",
    external: "/resume.pdf",
    desk: { right: "15%", top: "50%" },
  },
  {
    name: "github.url",
    tagline: "opens github in a new tab",
    description: "",
    icon: "/icons/git.png",
    iconSize: "w-12 h-12",
    external: "https://github.com/saifnot-safe",
    desk: { right: "24%", top: "34%" },
  },
  {
    name: "linkedin.url",
    tagline: "opens linkedin in a new tab",
    description: "",
    icon: "/icons/linkedin.png",
    iconSize: "w-12 h-12",
    external: "https://linkedin.com/in/saif-alshawaf",
    desk: { right: "34%", top: "46%" },
  },
];

const byName = (name: string) => files.find((f) => f.name === name);

// boot log: one "mounting" line per openable file, dots padded so the oks line up
const mountable = files.filter((f) => !f.external);
const mountWidth = Math.max(...mountable.map((f) => f.name.length)) + 1;
const bootLines = mountable.map((f) => ({
  label: `mounting ${f.name} ${".".repeat(mountWidth - f.name.length)} `,
  key: f.name,
}));
// mount lines plus the final "ready" line, spread over most of the boot
const BOOT_LINE_MS = Math.floor((BOOT_MS * 0.75) / (bootLines.length + 1));

// reads the viewport directly, so it is safe inside timeouts and event handlers
function isMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// a random spot that keeps a window of `width` fully on screen
function randomLeft(width: number, minLeft: number) {
  const maxLeft = Math.max(minLeft, window.innerWidth - width - EDGE_GAP);
  return minLeft + Math.random() * (maxLeft - minLeft);
}

function randomTop(minTop: number, range: number) {
  const maxTop = Math.max(minTop, window.innerHeight - 320);
  return Math.min(maxTop, minTop + Math.random() * range);
}

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [bootShown, setBootShown] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [wins, setWins] = useState<Win[]>([]);
  const zTop = useRef(20);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number } | null>(null);
  const openCount = useRef(0);
  // mobile sheets: whether we pushed a history entry, and where focus came from
  const sheetPushed = useRef(false);
  const sheetOpener = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLElement>(null);

  // keep isMobile in sync with the viewport so the layout updates on resize
  useEffect(() => {
    const update = () => setIsMobile(isMobileViewport());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const openFile = useCallback((file: FileItem) => {
    if (file.external) {
      window.open(file.external, "_blank", "noopener,noreferrer");
      return;
    }
    const mobile = isMobileViewport();
    const gen = ++openCount.current;
    if (mobile) {
      // one full-screen sheet; screenshots render inside it. the first sheet pushes a
      // history entry so the back gesture closes it, later ones just swap content
      if (!sheetPushed.current) {
        window.history.pushState({ sheet: true }, "");
        sheetPushed.current = true;
        if (document.activeElement instanceof HTMLElement) sheetOpener.current = document.activeElement;
      }
      zTop.current += 1;
      setWins([{ id: file.name, kind: "file", title: file.name, file, x: 0, y: 0, z: zTop.current, gen }]);
      return;
    }
    zTop.current += 1 + (file.screenshots?.length ?? 0);
    const z = zTop.current;
    const main: Win = {
      id: file.name,
      kind: "file",
      title: file.name,
      file,
      x: randomLeft(MAIN_WINDOW_WIDTH, 200),
      y: randomTop(80, 200),
      z,
      gen,
    };
    const images: Win[] = (file.screenshots ?? []).map((src, index) => ({
      id: `${file.name}:${src}`,
      kind: "image",
      title: src.split("/").pop() ?? src,
      src,
      pixelArt: file.pixelArt,
      x: randomLeft(IMAGE_WINDOW_WIDTH, 80),
      y: randomTop(80, 300),
      z: z - 1 - index,
      gen,
    }));
    // one artifact at a time: opening a file replaces what was open
    setWins([main, ...images]);
  }, []);

  // closing a sheet goes through history so the entry we pushed is consumed
  const closeSheet = useCallback(() => {
    if (sheetPushed.current) window.history.back();
    else setWins([]);
  }, []);

  // the phone's back gesture closes the sheet
  useEffect(() => {
    const onPop = () => {
      if (!sheetPushed.current) return;
      sheetPushed.current = false;
      setWins([]);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const sheet = isMobile ? wins.find((w) => w.kind === "file") : undefined;
  const sheetOpen = !!sheet;

  // lock the list behind an open sheet, then put it back where it was. position:fixed
  // is the lock that also holds on ios safari, which ignores overflow on body
  useEffect(() => {
    if (!sheetOpen) return;
    const y = window.scrollY;
    const body = document.body.style;
    const prev = { position: body.position, top: body.top, width: body.width };
    body.position = "fixed";
    body.top = `-${y}px`;
    body.width = "100%";
    // focus the sheet itself so the next tab lands on "← files"
    sheetRef.current?.focus({ preventScroll: true });
    return () => {
      Object.assign(body, prev);
      window.scrollTo(0, y);
      const opener = sheetOpener.current;
      sheetOpener.current = null;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [sheetOpen]);

  // boot screen once per session, skippable with any key or tap, then open about.txt
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem(BOOT_KEY, "1");
      } catch {}
      setBooting(false);
      const about = byName("about.txt");
      if (about) openFile(about);
    };
    let seen = false;
    try {
      seen = sessionStorage.getItem(BOOT_KEY) === "1";
    } catch {}
    const reduce = prefersReducedMotion();
    const total = bootLines.length + 1;
    const timers = [window.setTimeout(finish, seen ? 0 : reduce ? BOOT_REDUCED_MS : BOOT_MS)];
    if (!seen) {
      // reduced motion shows the whole log at once
      for (let i = reduce ? total : 1; i <= total; i++) {
        timers.push(window.setTimeout(() => setBootShown(i), reduce ? 0 : (i - 1) * BOOT_LINE_MS));
      }
    }
    window.addEventListener("keydown", finish, { once: true });
    window.addEventListener("pointerdown", finish, { once: true });
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [openFile]);

  // escape closes the window on top
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isMobileViewport()) {
        closeSheet();
        return;
      }
      setWins((prev) => {
        if (!prev.length) return prev;
        const top = prev.reduce((a, b) => (b.z > a.z ? b : a));
        if (top.expanded) return prev.map((w) => (w.id === top.id ? { ...w, expanded: false } : w));
        return prev.filter((w) => w.id !== top.id);
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSheet]);

  function focusWin(id: string) {
    setWins((prev) => {
      const top = Math.max(...prev.map((w) => w.z));
      const target = prev.find((w) => w.id === id);
      if (!target || target.z === top) return prev;
      zTop.current = top + 1;
      const z = zTop.current;
      return prev.map((w) => (w.id === id ? { ...w, z } : w));
    });
  }

  // expanding also raises the window so the enlarged screenshot is never covered
  function toggleExpand(id: string) {
    setWins((prev) => {
      zTop.current = Math.max(zTop.current, ...prev.map((w) => w.z)) + 1;
      const z = zTop.current;
      return prev.map((w) => (w.id === id ? { ...w, expanded: !w.expanded, z } : w));
    });
  }

  function closeWin(id: string) {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }

  function startDrag(e: ReactPointerEvent<HTMLDivElement>, w: Win) {
    if (isMobile || w.expanded || (e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: w.id, sx: e.clientX, sy: e.clientY, ox: w.x, oy: w.y };
  }

  function moveDrag(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const x = Math.max(0, Math.min(window.innerWidth - 80, d.ox + e.clientX - d.sx));
    const y = Math.max(0, Math.min(window.innerHeight - 40, d.oy + e.clientY - d.sy));
    setWins((prev) => prev.map((w) => (w.id === d.id ? { ...w, x, y } : w)));
  }

  function endDrag() {
    drag.current = null;
  }

  if (booting) {
    return (
      <main className="w-screen h-screen bg-black text-white flex items-center justify-center">
        <div className="text-sm tracking-wide">
          <div className="mb-4 text-lg text-center">SAIF ARCHIVE</div>
          {/* every line is laid out up front and revealed in place, so nothing shifts */}
          <div role="status" className="text-xs md:text-sm whitespace-pre" style={{ color: "var(--dim)" }}>
            {bootLines.map((line, i) => (
              <div key={line.key} style={{ visibility: i < bootShown ? "visible" : "hidden" }}>
                {line.label}
                <span className="text-white">ok</span>
              </div>
            ))}
            <div style={{ visibility: bootShown > bootLines.length ? "visible" : "hidden" }}>
              ready
              <span className="boot-cursor" aria-hidden="true" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // the window on top is the active one; the rest render dimmed
  const topZ = wins.length ? Math.max(...wins.map((w) => w.z)) : 0;

  const openByName = (name: string) => {
    const f = byName(name);
    if (f) openFile(f);
  };

  const renderWin = (w: Win) => {
    const expanded = w.expanded;
    const style: CSSProperties = expanded
      ? { zIndex: w.z }
      : { left: w.x, top: w.y, zIndex: w.z };
    const layout = expanded ? "win-expanded" : "absolute w-[420px]";
    return (
      <section
        key={`${w.id}:${w.gen}`}
        aria-label={w.title}
        className={`win win-open ${layout} ${w.z === topZ ? "is-active" : ""}`}
        style={style}
        onPointerDown={() => focusWin(w.id)}
      >
        <div
          className="win-bar"
          onPointerDown={(e) => startDrag(e, w)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span>{w.title}</span>
          <span className="flex items-center gap-3">
            {w.kind === "image" && (
              <button
                className="win-x"
                aria-label={`${expanded ? "restore" : "expand"} ${w.title}`}
                onClick={() => toggleExpand(w.id)}
              >
                {expanded ? "[−]" : "[+]"}
              </button>
            )}
            <button className="win-x" aria-label={`close ${w.title}`} onClick={() => closeWin(w.id)}>
              ×
            </button>
          </span>
        </div>

        {w.kind === "image" && w.src ? (
          <div className="p-2">
            <button
              className="shot"
              aria-label={`${expanded ? "restore" : "expand"} ${w.title}`}
              onClick={() => toggleExpand(w.id)}
            >
              <img
                src={w.src}
                alt={`${w.title} screenshot`}
                className={`w-full object-contain ${expanded ? "max-h-[80vh]" : "max-h-[240px]"} ${
                  w.pixelArt ? "pixelated" : ""
                }`}
              />
            </button>
          </div>
        ) : w.file ? (
          <FileBody file={w.file} onOpen={openByName} />
        ) : null}
      </section>
    );
  };

  // phones: the same window chrome, stretched to the viewport, with screenshots inline
  const renderSheet = (w: Win) => (
    <section
      key={w.id}
      ref={sheetRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={w.title}
      className="win is-active sheet"
    >
      <div className="win-bar sheet-bar">
        <button className="win-back" onClick={closeSheet}>
          ← files
        </button>
        <span>{w.title}</span>
      </div>
      <div className="sheet-body">
        {w.file && <FileBody file={w.file} onOpen={openByName} />}
        {w.file?.screenshots && (
          <div className="px-3 pb-6 space-y-3">
            {w.file.screenshots.map((src) => (
              <img
                key={src}
                src={src}
                alt={`${src.split("/").pop()} screenshot`}
                className={`w-full h-auto border ${w.file?.pixelArt ? "pixelated" : ""}`}
                style={{ borderColor: "var(--rule)" }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <main className="relative w-screen min-h-screen overflow-hidden bg-black text-white p-6">
      {isMobile ? (
        <>
          <nav aria-label="files" className="relative z-10 -mx-6 -mt-4 pb-12">
            <ul>
              {files.map((file) => {
                const row = (
                  <>
                    <img src={file.icon} alt="" className="w-8 h-8 object-contain pixelated shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-sm">{file.name}</span>
                      <span className="block text-xs" style={{ color: "var(--quiet)" }}>
                        {file.tagline}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={file.name}>
                    {file.external ? (
                      <a href={file.external} target="_blank" rel="noopener noreferrer" className="file-row">
                        {row}
                      </a>
                    ) : (
                      <button className="file-row" onClick={() => openFile(file)}>
                        {row}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          {sheet && renderSheet(sheet)}
        </>
      ) : (
        <>
          <nav aria-label="files" className="relative z-10 flex flex-wrap gap-8 w-fit lg:flex-col">
            {files.map((file) => (
              <button
                key={file.name}
                onClick={() => openFile(file)}
                className="desk-icon"
                style={
                  file.desk ? { position: "fixed", right: file.desk.right, top: file.desk.top } : undefined
                }
              >
                <img
                  src={file.icon}
                  alt=""
                  className={`${file.iconSize ?? "w-10 h-10"} object-contain pixelated`}
                />
                <span>{file.name}</span>
              </button>
            ))}
          </nav>

          {wins.map(renderWin)}
        </>
      )}

      {/* system text */}
      <div className="fixed z-10 bottom-4 right-4 text-xs" style={{ color: "var(--ghost)" }}>
        saifarchive.xyz
      </div>
    </main>
  );
}

// statuses that get the ● marker
const LIVE_STATUSES = ["live", "beta"];

function PropsBlock({ props }: { props: FileProps }) {
  const rows: [string, string][] = [
    ["type", props.type],
    ["role", props.role],
    ["status", LIVE_STATUSES.includes(props.status) ? `● ${props.status}` : props.status],
  ];
  return (
    <dl
      className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-xs md:text-sm pb-3 mb-3 border-b"
      style={{ borderColor: "var(--rule)" }}
    >
      {rows.map(([key, value]) => (
        <div key={key} className="contents">
          <dt style={{ color: "var(--quiet)" }}>{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FileBody({ file, onOpen }: { file: FileItem; onOpen: (name: string) => void }) {
  const jump = file.jump ?? [];
  return (
    <div className="p-3 landscape:p-2 md:p-4">
      {file.props && <PropsBlock props={file.props} />}
      <p
        className="text-xs md:text-sm mb-3 landscape:mb-2 whitespace-pre-line"
        style={{ color: "var(--dim)" }}
      >
        {file.description}
      </p>

      {file.status && (
        <ul className="text-xs md:text-sm mb-3 space-y-1">
          {file.status.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {file.stack && (
        <div className="mb-4 text-xs" style={{ color: "var(--quiet)" }}>
          {file.stack.join(" / ")}
        </div>
      )}

      {file.notes && (
        <ul
          className="text-xs md:text-sm space-y-1 md:space-y-2 mb-3 landscape:mb-2"
          style={{ color: "var(--dim)" }}
        >
          {file.notes.map((note) => (
            <li key={note}>- {note}</li>
          ))}
        </ul>
      )}

      {jump.length > 0 && (
        <p className="text-xs md:text-sm mb-3" style={{ color: "var(--dim)" }}>
          start with{" "}
          {jump.map((name, i) => (
            <span key={name}>
              <button className="inline-link text-white" onClick={() => onOpen(name)}>
                {name}
              </button>
              {i < jump.length - 2 ? ", " : i === jump.length - 2 ? " or " : ""}
            </span>
          ))}
        </p>
      )}

      {file.links && (
        <div className="flex flex-wrap gap-2">
          {file.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="btn"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
