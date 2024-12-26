import fs from 'fs';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import axios from 'axios';

// Get current directory using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const generateSitemap = async () => {
  const sitemap = new SitemapStream({ hostname: 'https://gofilez.com/' });

  // Define your static and dynamic URLs here
  const urls = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/login', changefreq: 'daily', priority: 0.8 },
    { url: '/signup', changefreq: 'daily', priority: 0.8 },
    { url: '/forgot-password', changefreq: 'monthly', priority: 0.7 },
    { url: '/home/:fileId', changefreq: 'daily', priority: 0.9 },
    { url: '/home', changefreq: 'daily', priority: 0.9 },
    { url: '/pricing', changefreq: 'monthly', priority: 0.7 },
    { url: '/profile', changefreq: 'weekly', priority: 0.8 },
    { url: '/dashboard/:type', changefreq: 'weekly', priority: 0.8 },
    { url: '/packages', changefreq: 'weekly', priority: 0.8 },
    { url: '/dashboard/all/accessible', changefreq: 'monthly', priority: 0.7 },
    { url: '/dashboard/all/shared', changefreq: 'monthly', priority: 0.7 },
    { url: '/dashboard/shared/:id', changefreq: 'monthly', priority: 0.7 },
    { url: '/dashboard/bin/all', changefreq: 'monthly', priority: 0.7 },
    { url: '/dashboard/folders/all', changefreq: 'monthly', priority: 0.7 },
    { url: '/dashboard/folders/all/:id', changefreq: 'monthly', priority: 0.7 },
    { url: '/admin/users', changefreq: 'monthly', priority: 0.6 },
    { url: '/admin/files', changefreq: 'monthly', priority: 0.6 },
    { url: '/admin/user/:userId', changefreq: 'monthly', priority: 0.6 },
    { url: '/404', changefreq: 'yearly', priority: 0.1 }
  ];

  // Add URLs to the sitemap
  urls.forEach((url) => {
    sitemap.write(url);
  });

  sitemap.end();

  // Write sitemap to file
  const xml = await streamToPromise(sitemap).then((sm) => sm.toString());
  fs.writeFileSync(path.resolve(__dirname, 'dist', 'sitemap.xml'), xml);
};

// Run the sitemap generation
generateSitemap().catch((err) => console.error(err));

export default generateSitemap;
