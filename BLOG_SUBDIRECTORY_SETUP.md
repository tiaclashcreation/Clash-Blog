# How to Deploy Your Blog as a Subdirectory of Your Main Site

## 1. Deploying as a Subdirectory

You want your blog to live at `https://clashcreation.com/blog` (and optionally at `https://www.verticalshortcut.com/blog`).

### **A. Deploy Blog as a Subdirectory**
- Deploy your main site at `https://clashcreation.com/`.
- Deploy your blog at `https://clashcreation.com/blog`.
- This is usually done by:
  - Hosting both on the same server and configuring your web server (Nginx, Apache, Vercel, Netlify, etc.) to route `/blog` to your blog app.
  - Or, using a reverse proxy to forward `/blog` requests to your blog app.

### **B. Deploy Blog Separately and Use a Reverse Proxy**
- If your main site and blog are on different platforms/hosts, set up a reverse proxy so that requests to `/blog` are transparently forwarded to your blog's deployment (e.g., on Vercel at `https://clash-blog.vercel.app/`).
- **Vercel Example:** Add this to your main site's `vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/blog/:match*", "destination": "https://clash-blog.vercel.app/:match*" }
    ]
  }
  ```
- Or, set up a similar rule in your main site's server config.

---

## 2. Update Metadata for Subdirectory

Update all absolute URLs in your blog's metadata to use the new subdirectory path.

### **A. Update URLs in `app/layout.tsx`**
- Change all instances of `https://clash-blog.vercel.app/` to `https://clashcreation.com/blog/`.
- Update Open Graph, Twitter, and canonical URLs.

**Example:**
```js
export const metadata: Metadata = {
  metadataBase: new URL('https://clashcreation.com/blog/'),
  openGraph: {
    url: 'https://clashcreation.com/blog/',
    images: [
      {
        url: 'https://clashcreation.com/blog/clash-blog-og.png',
        // ...
      }
    ],
    // ...
  },
  twitter: {
    images: ['https://clashcreation.com/blog/clash-blog-og.png'],
    // ...
  },
  // ...
};
```

### **B. Update Per-Post Metadata**
- In `app/posts/[slug]/page.tsx`, update the URLs:
  ```js
  url: `https://clashcreation.com/blog/posts/${post.slug?.current || post.slug}`,
  images: [imageUrl.replace('clash-blog.vercel.app', 'clashcreation.com/blog')],
  ```
- If your images are served from Sanity, you don't need to change those URLs. If you use local images, update the path to `/blog/your-image.png`.

---

## 3. Multiple Domains (verticalshortcut.com)

- You can set up a similar reverse proxy or rewrite rule on `verticalshortcut.com` to forward `/blog` to your blog app.
- Your blog will be accessible at both `https://clashcreation.com/blog` and `https://www.verticalshortcut.com/blog`.
- **It will NOT be a subdomain** of verticalshortcut.com unless you specifically set up a subdomain like `blog.verticalshortcut.com`.

---

## 4. SEO and Canonical Domain

- For SEO, pick one "canonical" domain (usually your main brand, e.g., `clashcreation.com`) and set all your metadata URLs and canonical tags to that.
- This tells Google which version to index and avoids duplicate content issues.

---

## 5. Best Practices

- **Robots.txt and Sitemap:** Make sure your robots.txt and sitemap.xml reflect the new URLs.
- **Canonical Tags:** If you use canonical tags, ensure they point to the new subdirectory URLs.
- **Internal Links:** Update any internal links in your blog to use `/blog/...` paths.
- **Test Social Sharing:** After deploying, test your new URLs with the [Twitter Card Validator](https://cards-dev.twitter.com/validator) and [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

---

## 6. Summary Table

| What to Update         | Old Value (Example)                        | New Value (Example)                        |
|-----------------------|--------------------------------------------|--------------------------------------------|
| metadataBase           | https://clash-blog.vercel.app/             | https://clashcreation.com/blog/            |
| og:url                 | https://clash-blog.vercel.app/             | https://clashcreation.com/blog/            |
| og:image, twitter:image| https://clash-blog.vercel.app/clash-blog-og.png | https://clashcreation.com/blog/clash-blog-og.png |
| Per-post URLs          | https://clash-blog.vercel.app/posts/slug   | https://clashcreation.com/blog/posts/slug  |

---

## 7. References
- [Vercel Rewrites Documentation](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vercel: Host Multiple Sites Under One Domain](https://vercel.com/guides/host-multiple-sites-in-one-vercel-project) 