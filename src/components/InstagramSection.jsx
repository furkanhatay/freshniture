import { InstagramIcon } from './Icons';
import { SectionTitle } from './SectionTitle';
import { instagramPosts as demoPosts } from '../data/catalog';
import { useSiteSettings } from '../store/SiteSettingsContext';
import { useInstagramFeed } from '../lib/useInstagramFeed';

export function InstagramSection() {
  const { site } = useSiteSettings();
  const { posts } = useInstagramFeed(site.instagramFeedUrl, demoPosts);
  return (
    <section className="section soft">
      <div className="shell">
        <SectionTitle
          eyebrow="Follow along"
          title="From the factory floor"
          copy="New collections, production updates and container loadings."
          action={
            <a className="insta-handle" href={site.instagramUrl} target="_blank" rel="noreferrer">
              <InstagramIcon size={20} />
              @{site.instagram}
            </a>
          }
        />

        <div className="insta-row">
          {posts.map((post) => (
            <a
              className="insta-tile"
              key={post.id}
              href={post.href || site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={post.caption || 'View on Instagram'}
            >
              <img src={post.image} alt="" loading="lazy" />
              {post.caption && <span className="it-overlay">{post.caption}</span>}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
