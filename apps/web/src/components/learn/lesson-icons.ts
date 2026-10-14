import { Award, FileText, HelpCircle, Image as ImageIcon, PlayCircle } from "lucide-react";

export const LESSON_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  video: PlayCircle,
  article: FileText,
  infographic: ImageIcon,
  quiz: HelpCircle,
  assignment: Award,
  resource: FileText,
};

// YouTube / Vimeo links become embeds; anything else plays as a file.
export function videoEmbed(url: string | null | undefined): string | null {
  if (!url) return null;
  const yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0`;
  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
