import React from "react";
import { IMG_MAP } from "@/lib/images";

type MemItem = { key: string; label: string; color: string };

// Mapping for Twemoji SVG codes
const TWEMOJI: Record<string, string> = {
  // animals
  Lion: "1f981",
  Tiger: "1f405",
  Cat: "1f431",
  Dog: "1f436",
  Cow: "1f42e",
  Horse: "1f434",
  Rabbit: "1f430",
  Bear: "1f43b",
  Fox: "1f98a",
  Panda: "1f43c",
  // fruits
  Apple: "1f34e",
  Banana: "1f34c",
  Grapes: "1f347",
  Orange: "1f34a",
  Mango: "1f96d",
  Kiwi: "1f95d",
  Peach: "1f351",
  Cherry: "1f352",
  Papaya: "1f96d",
  Pear: "1f350",
  // vegetables
  Carrot: "1f955",
  Potato: "1f954",
  Tomato: "1f345",
  Onion: "1f9c5",
  Corn: "1f33d",
  Peas: "1fada",
  Broccoli: "1f966",
  Beet: "1f966",
  Pumpkin: "1f383",
  Chili: "1f336",
  // birds
  Parrot: "1f99c",
  Eagle: "1f985",
  Owl: "1f989",
  Peacock: "1f99a",
  Sparrow: "1f426",
  Duck: "1f986",
  Crow: "1f426",
  Swan: "1f9a2",
  Hen: "1f414",
  Dove: "1f54a",
  // sea
  Fish: "1f41f",
  Shark: "1f988",
  Whale: "1f433",
  Octopus: "1f419",
  Crab: "1f980",
  Dolphin: "1f42c",
  Turtle: "1f422",
  Starfish: "2b50",
  Seal: "1f9ad",
  Jellyfish: "1fabc",
  // vehicles
  Car: "1f697",
  Bus: "1f68c",
  Train: "1f686",
  Plane: "2708",
  Ship: "1f6a2",
  Bike: "1f6b2",
  Truck: "1f69a",
  Rocket: "1f680",
  Boat: "26f5",
  Van: "1f690",
  // body
  Eye: "1f441",
  Ear: "1f442",
  Nose: "1f443",
  Mouth: "1f444",
  Hand: "270b",
  Foot: "1f9b6",
  Head: "1f9d1",
  Leg: "1f9b5",
  // family
  Mother: "1f469",
  Father: "1f468",
  Sister: "1f467",
  Brother: "1f466",
  Grandma: "1f475",
  Grandpa: "1f474",
  Baby: "1f476",
  Uncle: "1f468",
  // school
  Book: "1f4d6",
  Pencil: "270f",
  Bag: "1f392",
  Bottle: "1f37c",
  Ruler: "1f4cf",
  Eraser: "1f9fd",
  Crayon: "1f58d",
  Notebook: "1f4d3",
  // flowers
  Rose: "1f339",
  Lily: "1f337",
  Tulip: "1f337",
  Daisy: "1f33c",
  Sunflower: "1f33b",
  Lotus: "1fab7",
  Orchid: "1f33a",
  Jasmine: "1f4ae",
  // toys
  Ball: "26bd",
  Doll: "1fa86",
  Kite: "1fa81",
  Blocks: "1f9f1",
  Puzzle: "1f9e9",
  Teddy: "1f9f8",
  "Yo-Yo": "1fa80",
  Top: "1fa80",
  // insects
  Bee: "1f41d",
  Ant: "1f41c",
  Butterfly: "1f98b",
  Ladybug: "1f41e",
  Spider: "1f577",
  Grasshopper: "1f997",
  Beetle: "1fab2",
  Dragonfly: "1f41e",
  // weather
  Sun: "2600",
  Rain: "1f327",
  Cloud: "2601",
  Snow: "2744",
  Storm: "1f329",
  Wind: "1f4a8",
  Rainbow: "1f308",
  Fog: "1f32b",
  // music
  Drum: "1f941",
  Guitar: "1f3b8",
  Piano: "1f3b9",
  Flute: "1fa88",
  Violin: "1f3bb",
  Trumpet: "1f3ba",
  Harp: "1fa95",
  Tabla: "1f941"
};

const twemojiUrl = (cp: string) =>
  `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cp}.svg`;

// Shape SVG render helper
const ShapeSvg = ({ name, color }: { name: string; color: string }) => {
  const stroke = "rgba(0,0,0,0.15)";
  const common = { fill: color, stroke, strokeWidth: 2 } as const;
  switch (name) {
    case "Circle":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <circle cx="50" cy="50" r="42" {...common} />
        </svg>
      );
    case "Square":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <rect x="10" y="10" width="80" height="80" rx="6" {...common} />
        </svg>
      );
    case "Triangle":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="50,10 92,88 8,88" {...common} />
        </svg>
      );
    case "Star":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon
            points="50,6 61,38 95,38 67,58 78,92 50,72 22,92 33,58 5,38 39,38"
            {...common}
          />
        </svg>
      );
    case "Heart":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <path d="M50 86 L14 50 A20 20 0 0 1 50 24 A20 20 0 0 1 86 50 Z" {...common} />
        </svg>
      );
    case "Diamond":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="50,8 92,50 50,92 8,50" {...common} />
        </svg>
      );
    case "Oval":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <ellipse cx="50" cy="50" rx="42" ry="30" {...common} />
        </svg>
      );
    case "Cube":
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <polygon points="20,35 50,20 80,35 80,75 50,90 20,75" {...common} />
          <polyline points="20,35 50,50 80,35" fill="none" stroke={stroke} strokeWidth="2" />
          <line x1="50" y1="50" x2="50" y2="90" stroke={stroke} strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 100" className="w-3/5 h-3/5">
          <circle cx="50" cy="50" r="42" {...common} />
        </svg>
      );
  }
};

export const CardFace = ({ item, size = "md" }: { item: MemItem; size?: "sm" | "md" | "lg" }) => {
  const isColor = item.key.startsWith("c-");
  const isShape = item.key.startsWith("sh-");
  const isNumber = item.key.startsWith("nm-");
  const isLetter = item.key.startsWith("lt-");
  const qtyMatch = /^qty-(\d+)$/.exec(item.label);
  const cp = TWEMOJI[item.label];
  const bg = isColor ? item.color : `linear-gradient(135deg, #ffffff, ${item.color}22)`;

  return (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center shadow-inner overflow-hidden p-2"
      style={{ background: bg }}
      aria-label={item.label}
      role="img"
    >
      {isColor ? null : qtyMatch ? (
        (() => {
          const n = parseInt(qtyMatch[1], 10);
          const cols = n <= 3 ? n : n <= 6 ? 3 : 4;
          return (
            <div
              className="grid gap-1.5 place-items-center w-full h-full"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: n }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: "70%",
                    aspectRatio: "1 / 1",
                    background: item.color,
                    boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)"
                  }}
                />
              ))}
            </div>
          );
        })()
      ) : isShape ? (
        <ShapeSvg name={item.label} color={item.color} />
      ) : isNumber || isLetter ? (
        <span
          className={`font-display font-bold ${size === "sm" ? "text-3xl" : "text-5xl md:text-6xl"}`}
          style={{ color: item.color, textShadow: "0 2px 0 rgba(0,0,0,0.08)" }}
        >
          {item.label}
        </span>
      ) : IMG_MAP[item.label] ? (
        <img
          src={IMG_MAP[item.label]}
          alt={item.label}
          draggable={false}
          className={size === "sm" ? "w-3/5 h-3/5 object-contain" : "w-4/5 h-4/5 object-contain"}
          loading="lazy"
          decoding="async"
        />
      ) : cp ? (
        <img
          src={twemojiUrl(cp)}
          alt=""
          draggable={false}
          className={size === "sm" ? "w-3/5 h-3/5" : "w-4/5 h-4/5"}
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </div>
  );
};
