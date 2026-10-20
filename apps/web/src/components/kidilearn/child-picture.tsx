import { useState } from 'react'
import { CHILD_AVATARS } from '#/lib/kidilearn/family'
import type { ChildAvatar } from '#/lib/kidilearn/family'
import { OptimizedImage } from '#/components/site/optimized-image'
import { cn } from '#/lib/utils'

export function ChildPicture({
  name,
  photoUrl,
  avatar,
  className,
}: {
  name: string
  photoUrl: string | null
  avatar: ChildAvatar | null
  className?: string
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const classes = cn(
    'flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 object-cover text-3xl',
    className,
  )
  return photoUrl && photoUrl !== failedUrl ? (
    <OptimizedImage
      src={photoUrl}
      sizes="80px"
      maxWidth={256}
      alt={`${name}’s profile picture`}
      className={classes}
      onError={() => setFailedUrl(photoUrl)}
    />
  ) : (
    <span className={classes} aria-hidden="true">
      {CHILD_AVATARS[avatar ?? 'sun']}
    </span>
  )
}
