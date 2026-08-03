import { useEffect, useState } from 'react';

const MAX_POSTS = 12;

/** Behold.so post → the shape InstagramSection renders. */
function mapPost(post) {
  const image = post.sizes?.medium?.mediaUrl || post.sizes?.small?.mediaUrl || post.mediaUrl;
  if (!image) return null;
  return {
    id: post.id,
    image,
    caption: (post.caption || post.prunedCaption || '').trim(),
    href: post.permalink,
  };
}

/**
 * Live Instagram photos from a Behold.so feed URL (see admin → Settings →
 * Instagram → "Live feed URL"). Falls back to `fallbackPosts` — and keeps
 * showing them — if no feed is configured, the feed is unreachable, or the
 * response doesn't look like a Behold feed. The section never breaks or
 * shows empty.
 */
export function useInstagramFeed(feedUrl, fallbackPosts) {
  const [posts, setPosts] = useState(fallbackPosts);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!feedUrl?.trim()) {
      setPosts(fallbackPosts);
      setIsLive(false);
      return undefined;
    }

    let cancelled = false;

    fetch(feedUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Feed returned ${res.status}`))))
      .then((data) => {
        if (cancelled) return;
        const live = (data.posts || [])
          .filter((p) => p.visibility !== 'hidden')
          .map(mapPost)
          .filter(Boolean)
          .slice(0, MAX_POSTS);
        if (live.length > 0) {
          setPosts(live);
          setIsLive(true);
        }
      })
      .catch(() => {
        // Feed unreachable or malformed — keep showing the fallback posts.
      });

    return () => { cancelled = true; };
  }, [feedUrl, fallbackPosts]);

  return { posts, isLive };
}
