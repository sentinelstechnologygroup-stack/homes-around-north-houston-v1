import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_ORIGIN, pageMetadata } from '@/lib/seo';
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const metadata = pageMetadata(pathname);
    document.title = metadata.title;
    const canonical = `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname}`;
    for (const [name, value, property] of [
      ['description', metadata.description, false], ['robots', metadata.noindex ? 'noindex,follow' : 'index,follow', false],
      ['og:title', metadata.title, true], ['og:description', metadata.description, true], ['og:url', canonical, true],
    ]) {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attr, name); document.head.appendChild(tag); }
      tag.setAttribute('content', value);
    }
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);
  }, [pathname]);
  return null;
}
