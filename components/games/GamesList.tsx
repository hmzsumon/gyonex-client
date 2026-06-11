"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

/* ---------- demo data (তোমার API থেকে আনো) ---------- */
type Provider = "ALL" | "JILI" | "PG" | "SPRIBE" | "PP";
type Game = {
  id: string;
  name: string;
  provider: Exclude<Provider, "ALL">;
  thumb?: string; // image url
  hot?: boolean;
  new?: boolean;
  link?: string; // link to game page
};

const PROVIDERS: { key: Provider; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "JILI", label: "JILI" },
  { key: "PG", label: "PG" },
  { key: "SPRIBE", label: "SPRIBE" },
  { key: "PP", label: "PRAGMATIC PLAY" },
];

const GAMES: Game[] = [
  {
    id: "1",
    name: "2 Fortunes Souls",
    provider: "PP",
    thumb: "/images/games/game_01.png",
    hot: true,
    link: "/lucky-wheel", // link to game page
  },
  {
    id: "2",
    name: "CUBE?",
    provider: "PP",
    thumb: "/images/games/game_02.png",
    link: "/lucky-wheel",
  },
  {
    id: "3",
    name: "Gates of Olympus",
    provider: "PP",
    thumb: "/images/games/game_03.png",
    hot: true,
    link: "/lucky-wheel",
  },
  {
    id: "4",
    name: "Aviator",
    provider: "SPRIBE",
    thumb: "/images/games/game_04.png",
    link: "/lucky-wheel",
  },
  {
    id: "5",
    name: "Master of Gold Miner",
    provider: "PG",
    thumb: "/images/games/game_05.png",
    link: "/lucky-wheel",
  },
  {
    id: "6",
    name: "Kraken Queen",
    provider: "JILI",
    thumb: "/images/games/game_06.png",
    new: true,
    link: "/lucky-wheel",
  },
  {
    id: "7",
    name: "3 China Pots",
    provider: "PG",
    thumb: "/images/games/game_07.png",
    link: "/lucky-wheel",
  },
  {
    id: "8",
    name: "Golden Bon",
    provider: "JILI",
    thumb: "/images/games/game_08.png",
    link: "/lucky-wheel",
  },
  {
    id: "9",
    name: "FlyX",
    provider: "SPRIBE",
    thumb: "/images/games/game_09.png",
    link: "/lucky-wheel",
  },
  {
    id: "10",
    name: "3 Tombs",
    provider: "PP",
    thumb: "/images/games/game_10.png",
    link: "/lucky-wheel",
  },
  {
    id: "11",
    name: "Lizard Riches",
    provider: "PG",
    thumb: "/images/games/game_11.png",
    link: "/lucky-wheel",
  },
  {
    id: "12",
    name: "Old Gun",
    provider: "JILI",
    thumb: "/images/games/game_12.png",
    link: "/lucky-wheel",
  },
];

/* ---------------- small atoms ---------------- */
const TopBar = () => (
  <div className="sticky top-0 z-10 flex items-center gap-3 bg-[#0f4d3f] px-4 py-3 text-yellow-300">
    <button
      onClick={() => history.back()}
      aria-label="Back"
      className="rounded p-1 hover:bg-black/10"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" className="fill-current">
        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
    <h1 className="text-lg font-semibold">Slots</h1>
  </div>
);

const ProviderTabs: React.FC<{
  value: Provider;
  onChange: (p: Provider) => void;
}> = ({ value, onChange }) => (
  <div className="rounded-xl border border-[#00493B] bg-[#012E25] p-2">
    <div className="flex items-center gap-2 overflow-x-auto">
      {PROVIDERS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key)}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition
          ${
            value === p.key
              ? "bg-yellow-400 text-[#0F172A]"
              : "bg-[#073328] text-white/80 hover:bg-[#094235]"
          }`}
        >
          {p.label}
        </button>
      ))}
      {/* right icons */}
      <div className="ml-auto flex items-center gap-2 pr-1">
        <button
          className="rounded-lg border border-[#00493B] bg-[#01241D] p-2 hover:bg-[#073328]"
          title="Filter"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="fill-white/80"
          >
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  onReload: () => void;
}> = ({ value, onChange, onClear, onReload }) => (
  <div className="mt-3 grid grid-cols-[1fr_auto_auto] items-center gap-2">
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Game name"
        className="w-full rounded-lg border border-[#00493B] bg-[#01241D] px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1c6b5a]"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          className="fill-white/80"
        >
          <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.57-4.23C15.99 6.01 13.98 4 11.5 4S7.01 6.01 7.01 9.5 9.02 15 11.5 15c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 19.49 21.49 18 15.5 14zM11.5 13C10.12 13 9 11.88 9 10.5S10.12 8 11.5 8 14 9.12 14 10.5 12.88 13 11.5 13z" />
        </svg>
      </span>
    </div>
    <button
      onClick={onReload}
      className="rounded-lg border border-[#00493B] bg-[#01241D] p-2 hover:bg-[#073328]"
      title="Reload"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="fill-white/80">
        <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5a5 5 0 0 1-8.66 3.54l-1.42 1.42A7 7 0 1 0 19 13c0-3.87-3.13-7-7-7z" />
      </svg>
    </button>
    <button
      onClick={onClear}
      className="rounded-lg border border-[#00493B] bg-[#01241D] p-2 hover:bg-[#073328]"
      title="Clear"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="fill-white/80">
        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    </button>
  </div>
);

const GameCard: React.FC<{
  game: Game;
  liked: boolean;
  onToggleLike: () => void;
}> = ({ game, liked, onToggleLike }) => (
  <Link href="/loading" className="block">
    <div className="relative overflow-hidden rounded-xl border border-[#00493B] bg-[#073328]">
      {/* poster */}
      <div className="relative h-36 w-full">
        {game.thumb ? (
          <Image
            src={game.thumb}
            alt={game.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#0a2c24] to-[#0d3b30]" />
        )}
        {/* heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleLike();
          }}
          aria-label="favorite"
          className="absolute right-2 top-2 rounded-full bg-black/40 p-1.5 hover:bg-black/60"
        >
          {liked ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-rose-400"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.22 2.44C11.09 5 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-white/80"
            >
              <path d="M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.42 2,8.5C2,12.28 5.4,15.36 10.55,20.04L12,21.35L13.45,20.03C18.6,15.36 22,12.28 22,8.5C22,5.42 19.58,3 16.5,3M12.1,18.55L12,18.65L11.9,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,5.99 11.07,7.36H12.94C13.46,5.99 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55Z" />
            </svg>
          )}
        </button>

        {/* provider badge */}
        <span className="absolute left-2 top-2 rounded bg-black/50 px-2 py-0.5 text-[10px] uppercase tracking-wide">
          {game.provider}
        </span>

        {/* hot/new */}
        {game.hot && (
          <span className="absolute left-2 bottom-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px]">
            HOT
          </span>
        )}
        {game.new && (
          <span className="absolute left-12 bottom-2 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px]">
            NEW
          </span>
        )}
      </div>

      {/* footer */}
      <div className="px-2 py-2">
        <p className="line-clamp-1 text-[13px]">{game.name}</p>
      </div>
    </div>
  </Link>
);

/* ------------------------- page ------------------------- */
const GamesList: React.FC = () => {
  const [provider, setProvider] = useState<Provider>("ALL");
  const [q, setQ] = useState("");
  const [likes, setLikes] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = [...GAMES];
    if (provider !== "ALL") list = list.filter((g) => g.provider === provider);
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(term));
    }
    return list;
  }, [provider, q]);

  const toggleLike = (id: string) =>
    setLikes((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  return (
    <div className="min-h-screen bg-[#01241D] text-white">
      <TopBar />

      <div className="mx-auto w-full  px-4 py-4">
        <ProviderTabs value={provider} onChange={setProvider} />
        <SearchBar
          value={q}
          onChange={setQ}
          onClear={() => setQ("")}
          onReload={() => window.location.reload()}
        />

        {/* grid */}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {filtered.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              liked={likes.has(g.id)}
              onToggleLike={() => toggleLike(g.id)}
            />
          ))}
          {!filtered.length && (
            <div className="col-span-3 rounded-xl border border-dashed border-[#00493B] bg-[#031A15] p-6 text-center sm:col-span-4 md:col-span-5">
              <p className="text-white/70">No games found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesList;
