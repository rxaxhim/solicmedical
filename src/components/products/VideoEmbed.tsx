import { youtubeId, type ProductVideo } from "@/lib/products";

export default function VideoEmbed({ video }: { video: ProductVideo }) {
  const id = youtubeId(video.youtube_url);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="aspect-video bg-navy-900">
        {id ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <a
            href={video.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-center justify-center text-sm text-white/80 underline"
          >
            Watch video
          </a>
        )}
      </div>
      <p className="p-4 font-medium text-navy-900">{video.title}</p>
    </div>
  );
}
