#!/usr/bin/env node
// Regenerates /posts/<slug>/index.html, /posts/manifest.json, and sitemap.xml
// from published Supabase posts, so each post has its own crawlable, indexable
// URL. Reuses the CSS and Supabase credentials straight out of index.html so
// there's a single source of truth for styling and config.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_URL = 'https://stoopsidescribbles.com';

const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8');

function extractConst(name) {
  const match = indexHtml.match(new RegExp(`const ${name} = '([^']+)'`));
  if (!match) throw new Error(`Could not find ${name} in index.html`);
  return match[1];
}

const SUPABASE_URL = extractConst('SUPABASE_URL');
const SUPABASE_ANON_KEY = extractConst('SUPABASE_ANON_KEY');

const styleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) throw new Error('Could not find <style> block in index.html');
const SHARED_CSS = styleMatch[1];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'post';
}

function excerptOf(content, max = 155) {
  const text = content.trim().replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

async function fetchPublishedPosts() {
  const url = `${SUPABASE_URL}/rest/v1/posts?select=*&published=eq.true&order=created_at.asc`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
  return res.json();
}

// Oldest post wins the bare slug; later duplicates get -2, -3, etc. Keeps
// existing URLs stable across rebuilds as new posts are added.
function assignSlugs(posts) {
  const used = new Set();
  return posts.map((post) => {
    const base = slugify(post.title);
    let candidate = base;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${n++}`;
    }
    used.add(candidate);
    return { ...post, slug: candidate };
  });
}

function renderPostPage(post) {
  const url = `${SITE_URL}/posts/${post.slug}/`;
  const description = excerptOf(post.content);
  const title = escapeHtml(post.title);
  const descEscaped = escapeHtml(description);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — Stoopside Scribbles</title>

    <link rel="icon" href="https://cdn-icons-png.freepik.com/512/16077/16077310.png" type="image/png">

    <meta name="description" content="${descEscaped}">
    <meta name="author" content="Stoopside Scribbles">

    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${descEscaped}">
    <meta property="og:image" content="${SITE_URL}/header.png">

    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${descEscaped}">
    <meta property="twitter:image" content="${SITE_URL}/header.png">

    <style>${SHARED_CSS}</style>

<script async src="https://www.googletagmanager.com/gtag/js?id=G-ME0QNDD3XB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ME0QNDD3XB');
</script>
<script type="text/javascript">
  (function(e,c){if(!c.__SV){var l,h;window.mixpanel=c;c._i=[];c.init=function(q,r,f){function t(d,a){var g=a.split(".");2==g.length&&(d=d[g[0]],a=g[1]);d[a]=function(){d.push([a].concat(Array.prototype.slice.call(arguments,0)))}}var b=c;"undefined"!==typeof f?b=c[f]=[]:f="mixpanel";b.people=b.people||[];b.toString=function(d){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);d||(a+=" (stub)");return a};b.people.toString=function(){return b.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
  for(h=0;h<l.length;h++)t(b,l[h]);var n="set set_once union unset remove delete".split(" ");b.get_group=function(){function d(p){a[p]=function(){b.push([g,[p].concat(Array.prototype.slice.call(arguments,0))])}}for(var a={},g=["get_group"].concat(Array.prototype.slice.call(arguments,0)),m=0;m<n.length;m++)d(n[m]);return a};c._i.push([q,r,f])};c.__SV=1.2;var k=e.createElement("script");k.type="text/javascript";k.async=!0;k.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===
  e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=e.getElementsByTagName("script")[0];e.parentNode.insertBefore(k,e)}})(document,window.mixpanel||[])

  mixpanel.init('04b970e30974755f7e909c64f830ef4a', {
    autocapture: true,
    record_sessions_percent: 100,
  })

  const __post = ${JSON.stringify({ title: post.title, date: post.date, is_pinned: !!post.is_pinned })};
  let __maxScroll = 0;
  const __readStart = Date.now();
  mixpanel.track('Article Opened', { 'Article Title': __post.title, 'Article Date': __post.date, 'Is Pinned': __post.is_pinned, 'Direct Link': true });
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const pct = Math.round((window.scrollY / docHeight) * 100);
      if (pct > __maxScroll) __maxScroll = pct;
    }
  });
  window.addEventListener('beforeunload', () => {
    mixpanel.track('Article Read', {
      'Article Title': __post.title,
      'Article Date': __post.date,
      'Seconds Spent': Math.round((Date.now() - __readStart) / 1000),
      'Max Scroll Percent': __maxScroll,
    });
  });
</script>
</head>
<body>
<a href="/"><img src="/header.png" alt="Stoopside Scribbles - From porch to page" class="header-img"></a>

<div style="margin-bottom: 30px;">
    <a href="/" style="color: #666; text-decoration: none;">← All posts</a>
</div>

<article>
    <h2 style="font-size: 20px; font-weight: normal; margin-bottom: 10px;">${title}</h2>
    <div style="color: #666; font-size: 14px; margin-bottom: 20px;">${formatDate(post.date)}</div>
    <div style="white-space: pre-wrap; line-height: 1.8;">${escapeHtml(post.content.trim())}</div>
</article>

<footer style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
    <a href="mailto:ellie@stoopsidescribbles.com" style="color: #bbb; font-size: 13px; text-decoration: none;">ellie@stoopsidescribbles.com</a>
</footer>
</body>
</html>
`;
}

function renderSitemap(posts) {
  const urls = [
    `${SITE_URL}/`,
    ...posts.map((p) => `${SITE_URL}/posts/${p.slug}/`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
}

async function main() {
  const rawPosts = await fetchPublishedPosts();
  const posts = assignSlugs(rawPosts);

  const postsDir = join(ROOT, 'posts');
  rmSync(postsDir, { recursive: true, force: true });
  mkdirSync(postsDir, { recursive: true });

  for (const post of posts) {
    const dir = join(postsDir, post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), renderPostPage(post));
  }

  writeFileSync(
    join(postsDir, 'manifest.json'),
    JSON.stringify(posts.map((p) => ({ id: p.id, slug: p.slug })), null, 2) + '\n'
  );

  writeFileSync(join(ROOT, 'sitemap.xml'), renderSitemap(posts));

  if (!existsSync(join(ROOT, 'robots.txt'))) {
    writeFileSync(join(ROOT, 'robots.txt'), `Sitemap: ${SITE_URL}/sitemap.xml\n`);
  }

  console.log(`Generated ${posts.length} post page(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
