import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Globe, ImagePlus, Lock, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { useMember } from "#/hooks/useMember";
import { Avatar, GalleryUpload } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export function Composer({ onPosted, wallUserId, wallName, pageId, placeholder }: { onPosted: () => void; wallUserId?: number; wallName?: string; pageId?: number; placeholder?: string }) {
  const me = useMember();
  const [body, setBody] = useState("");
  const [images, setImages] = useState<Array<string>>([]);
  const [showPhotos, setShowPhotos] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "friends" | "only_me">("public");
  const [asPage, setAsPage] = useState<number | "">(pageId ?? "");
  const { data: pages } = useQuery({ queryKey: ["my-pages"], queryFn: () => api.get<{ owned: Array<Row> }>("/social/pages/mine"), enabled: !wallUserId && !pageId });
  const post = useMutation({
    mutationFn: () => api.post("/social/posts", { body, images, visibility, wallUserId, pageId: asPage || undefined }),
    onSuccess: () => {
      setBody("");
      setImages([]);
      setShowPhotos(false);
      onPosted();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!me) return null;
  const VisIcon = visibility === "public" ? Globe : visibility === "friends" ? Users : Lock;
  return (
    <form
      className="rounded-2xl border bg-white p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (body.trim() || images.length) post.mutate();
      }}
    >
      <div className="flex gap-3">
        <Avatar src={me.avatarUrl} name={me.fullName} />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={body.length > 80 ? 4 : 2}
          placeholder={placeholder ?? (wallName ? `Write something to ${wallName}…` : `What's on your mind, ${me.fullName.split(" ")[0]}?`)}
          className="flex-1 resize-none rounded-2xl bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sys-social/30"
        />
      </div>
      {showPhotos && (
        <div className="mt-3">
          <GalleryUpload value={images} onChange={setImages} folder="posts" max={10} />
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowPhotos(!showPhotos)} className="text-emerald-700">
          <ImagePlus /> Photo
        </Button>
        {!wallUserId && !pageId && !asPage && (
          <label className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
            <VisIcon className="size-4" />
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as typeof visibility)} className="bg-transparent outline-none" aria-label="Who can see this">
              <option value="public">Public</option>
              <option value="friends">Friends</option>
              <option value="only_me">Only me</option>
            </select>
          </label>
        )}
        {!wallUserId && !pageId && (pages?.owned.length ?? 0) > 0 && (
          <select value={asPage} onChange={(e) => setAsPage(e.target.value ? Number(e.target.value) : "")} className="rounded-lg border px-2 py-1 text-sm" aria-label="Post as">
            <option value="">Post as me</option>
            {pages!.owned.map((p) => (
              <option key={p.id} value={p.id}>
                Post as {p.name}
              </option>
            ))}
          </select>
        )}
        <Button type="submit" size="sm" className={cn("ml-auto bg-sys-social hover:bg-sys-social/90")} disabled={post.isPending || (!body.trim() && !images.length)}>
          Post
        </Button>
      </div>
    </form>
  );
}
