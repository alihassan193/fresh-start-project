import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { contentApi } from '@/lib/api';

interface MetaData {
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
}

const DEFAULT_META: MetaData = {
  meta_title: 'Desert Safari Dubai - Best Dubai Desert Safari Tours & Packages',
  meta_description: 'Experience the ultimate desert safari adventure in Dubai. Choose from evening safaris, VIP tours, overnight camping & more. Book your Dubai desert safari today!',
  meta_keywords: 'desert safari Dubai, Dubai desert safari, desert safari tours, Dubai adventure, dune bashing, camel ride, BBQ dinner, desert safari packages',
  og_title: 'Desert Safari Dubai - Unforgettable Desert Adventures',
  og_description: 'Explore the best desert safari experiences in Dubai with dune bashing, camel rides, BBQ dinners and cultural entertainment. Book now!',
  og_image: 'https://desert-safaridubai.ae/assets/images/logos/favicon.png',
  canonical_url: 'https://desert-safaridubai.ae'
};

export const useMetadata = () => {
  const location = useLocation();

  useEffect(() => {
    const fetchAndApplyMetadata = async () => {
      try {
        const response = await contentApi.getMetaByUrl(location.pathname);
        
        if (response.success && response.data) {
          applyMetadata(response.data);
        } else {
          applyMetadata(DEFAULT_META);
        }
      } catch (error) {
        console.log('No metadata found for this page, using defaults');
        applyMetadata(DEFAULT_META);
      }
    };

    fetchAndApplyMetadata();
  }, [location.pathname]);
};

const applyMetadata = (meta: MetaData) => {
  // Update title
  if (meta.meta_title) {
    document.title = meta.meta_title;
  }

  // Update or create meta tags
  updateMetaTag('name', 'description', meta.meta_description);
  updateMetaTag('name', 'keywords', meta.meta_keywords);
  
  // Open Graph tags
  updateMetaTag('property', 'og:title', meta.og_title);
  updateMetaTag('property', 'og:description', meta.og_description);
  updateMetaTag('property', 'og:image', meta.og_image);
  updateMetaTag('property', 'og:type', 'website');
  
  // Twitter Card tags
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:title', meta.og_title);
  updateMetaTag('name', 'twitter:description', meta.og_description);
  updateMetaTag('name', 'twitter:image', meta.og_image);

  // Canonical URL
  updateCanonicalLink(meta.canonical_url);
};

const updateMetaTag = (
  attribute: 'name' | 'property',
  attributeValue: string,
  content?: string
) => {
  if (!content) return;

  let element = document.querySelector(
    `meta[${attribute}="${attributeValue}"]`
  ) as HTMLMetaElement;

  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    element.content = content;
    document.head.appendChild(element);
  }
};

const updateCanonicalLink = (url?: string) => {
  if (!url) return;

  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (element) {
    element.href = url;
  } else {
    element = document.createElement('link');
    element.rel = 'canonical';
    element.href = url;
    document.head.appendChild(element);
  }
};
