import { useEffect, useState } from 'react';
import { packageApi, blogApi } from '@/lib/api';

const BASE_URL = 'https://desert-safaridubai.ae';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const SitemapXml = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [urlCount, setUrlCount] = useState(0);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const urls: SitemapUrl[] = [];

        // Static pages
        const staticPages = [
          { path: '/', changefreq: 'daily' as const, priority: 1.0 },
          { path: '/tours', changefreq: 'daily' as const, priority: 0.9 },
          { path: '/about', changefreq: 'monthly' as const, priority: 0.7 },
          { path: '/contact', changefreq: 'monthly' as const, priority: 0.7 },
          { path: '/gallery', changefreq: 'weekly' as const, priority: 0.6 },
          { path: '/blogs', changefreq: 'daily' as const, priority: 0.8 },
          { path: '/sitemap', changefreq: 'weekly' as const, priority: 0.5 },
          { path: '/privacy', changefreq: 'yearly' as const, priority: 0.3 },
          { path: '/terms', changefreq: 'yearly' as const, priority: 0.3 },
        ];

        staticPages.forEach(page => {
          urls.push({
            loc: `${BASE_URL}${page.path}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: page.changefreq,
            priority: page.priority,
          });
        });

        // Fetch dynamic tours/packages
        try {
          const packagesResponse = await packageApi.getAll({ limit: 500 });
          const packagesData = packagesResponse.data?.packages || packagesResponse.data || [];
          if (Array.isArray(packagesData)) {
            packagesData.forEach((pkg: { slug: string; updated_at?: string }) => {
              if (pkg.slug) {
                urls.push({
                  loc: `${BASE_URL}/tours/${pkg.slug}`,
                  lastmod: pkg.updated_at ? new Date(pkg.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                  changefreq: 'weekly',
                  priority: 0.8,
                });
              }
            });
          }
        } catch (error) {
          console.error('Error fetching packages for sitemap:', error);
        }

        // Fetch dynamic blog posts
        try {
          const blogsResponse = await blogApi.getAll({ limit: 500 });
          const blogsData = blogsResponse.data?.blogs || blogsResponse.data || [];
          if (Array.isArray(blogsData)) {
            blogsData.forEach((blog: { slug: string; updated_at?: string }) => {
              if (blog.slug) {
                urls.push({
                  loc: `${BASE_URL}/blogs/${blog.slug}`,
                  lastmod: blog.updated_at ? new Date(blog.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                  changefreq: 'weekly',
                  priority: 0.7,
                });
              }
            });
          }
        } catch (error) {
          console.error('Error fetching blogs for sitemap:', error);
        }

        setUrlCount(urls.length);
        const xml = generateXml(urls);
        setSitemapXml(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  const generateXml = (urls: SitemapUrl[]): string => {
    const urlElements = urls
      .map(
        url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  };

  const escapeXml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const downloadSitemap = () => {
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(sitemapXml);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating XML sitemap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">XML Sitemap Generator</h1>
              <p className="text-muted-foreground mt-1">
                {urlCount} URLs included • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
              >
                Copy XML
              </button>
              <button
                onClick={downloadSitemap}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Download sitemap.xml
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border">
              <span className="text-sm font-mono text-muted-foreground">sitemap.xml</span>
            </div>
            <div className="p-4 overflow-auto max-h-[70vh]">
              <pre className="text-sm text-card-foreground whitespace-pre font-mono leading-relaxed">
                {sitemapXml}
              </pre>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <h2 className="font-semibold text-foreground mb-2">How to use this sitemap:</h2>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Download the <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">sitemap.xml</code> file</li>
              <li>Upload it to your website's root directory</li>
              <li>Submit the sitemap URL to Google Search Console and Bing Webmaster Tools</li>
              <li>The sitemap URL will be: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{BASE_URL}/sitemap.xml</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapXml;
