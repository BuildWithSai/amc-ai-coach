import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { AMCTopic } from "../types";

export const AMC_TOPICS: AMCTopic[] = [
  "Cardiology",
  "Respiratory Medicine",
  "Gastroenterology",
  "Neurology",
  "Obstetrics & Gynaecology",
  "Paediatrics",
  "Psychiatry",
  "Surgery",
  "Pharmacology",
  "Endocrinology",
  "Infectious Diseases",
  "Renal Medicine",
  "Musculoskeletal",
  "Dermatology",
  "Haematology",
];

export const TOPIC_COLORS: Record<AMCTopic, { bg: string; text: string }> = {
  "Cardiology":               { bg: "bg-red-50",     text: "text-red-700"     },
  "Respiratory Medicine":     { bg: "bg-cyan-50",    text: "text-cyan-700"    },
  "Gastroenterology":         { bg: "bg-amber-50",   text: "text-amber-700"   },
  "Neurology":                { bg: "bg-indigo-50",  text: "text-indigo-700"  },
  "Obstetrics & Gynaecology": { bg: "bg-rose-50",    text: "text-rose-700"    },
  "Paediatrics":              { bg: "bg-green-50",   text: "text-green-700"   },
  "Psychiatry":               { bg: "bg-violet-50",  text: "text-violet-700"  },
  "Surgery":                  { bg: "bg-orange-50",  text: "text-orange-700"  },
  "Pharmacology":             { bg: "bg-purple-50",  text: "text-purple-700"  },
  "Endocrinology":            { bg: "bg-pink-50",    text: "text-pink-700"    },
  "Infectious Diseases":      { bg: "bg-lime-50",    text: "text-lime-700"    },
  "Renal Medicine":           { bg: "bg-sky-50",     text: "text-sky-700"     },
  "Musculoskeletal":          { bg: "bg-emerald-50", text: "text-emerald-700" },
  "Dermatology":              { bg: "bg-teal-50",    text: "text-teal-700"    },
  "Haematology":              { bg: "bg-fuchsia-50", text: "text-fuchsia-700" },
};

export function TopicPill({ topic }: { topic: AMCTopic }) {
  const { bg, text } = TOPIC_COLORS[topic];
  return (
    <span
      className={`inline-block max-w-full truncate rounded-full px-2.5 py-0.5 text-[12px] font-medium ${bg} ${text}`}
    >
      {topic}
    </span>
  );
}

export function TopicSelect({
  value,
  onChange,
}: {
  value: AMCTopic;
  onChange: (t: AMCTopic) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[38px] w-full items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 transition-colors duration-150 hover:bg-gray-200/70"
      >
        <TopicPill topic={value} />
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-secondary" />
      </button>
      {open && (
        <div className="absolute top-full z-20 mt-1.5 max-h-52 w-full overflow-y-auto rounded-xl bg-white py-1.5 shadow-lg shadow-black/10">
          {AMC_TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                onChange(t);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-1.5 text-left transition-colors duration-100 hover:bg-gray-50 ${
                t === value ? "bg-gray-50/80" : ""
              }`}
            >
              <TopicPill topic={t} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
