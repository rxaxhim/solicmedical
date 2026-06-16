"use client";

import { useState } from "react";
import VideoEmbed from "./VideoEmbed";
import type { ProductVideo } from "@/lib/products";

const INITIAL_VISIBLE = 6;

export default function VideoGrid({ videos }: { videos: ProductVideo[] }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? videos : videos.slice(0, INITIAL_VISIBLE);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((v) => (
          <VideoEmbed key={v.id} video={v} />
        ))}
      </div>

      {videos.length > INITIAL_VISIBLE && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="btn-ghost"
          >
            {showAll ? "Show fewer" : `Show all ${videos.length} videos`}
          </button>
        </div>
      )}
    </div>
  );
}
