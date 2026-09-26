import { getTheme } from '@/lib/api/theme';
import { getProducts } from '@/lib/api/products';
import { getCollections, getCategories } from '@/lib/api/catalog';
import { resolveTemplate } from '@/templates';
import { SectionResolver } from '@/lib/sections/SectionResolver';
import { DEFAULT_TEMPLATE_SECTIONS } from '@/lib/sections/types';
import type { SectionConfig } from '@/lib/sections/types';

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const previewTemplate = resolvedParams?.previewTemplate as string | undefined;

  const [theme, products, collections, categories] = await Promise.all([
    getTheme(),
    getProducts({ limit: 16 }),
    getCollections(),
    getCategories(),
  ]);

  // Allow CMS to preview any template via ?previewTemplate=<slug> without publishing
  const effectiveTheme = previewTemplate
    ? { ...theme, activeTemplateSlug: previewTemplate }
    : theme;

  const activeSlug = effectiveTheme.activeTemplateSlug || 'mincom';
  const { Header, Footer, HomePage: FallbackHomePage } = resolveTemplate(activeSlug);

  // Check for custom homepage sections configured in CMS Theme Studio
  let customSections: SectionConfig[] | null = null;
  if (effectiveTheme.homeSectionsJson) {
    try {
      const parsed = JSON.parse(effectiveTheme.homeSectionsJson);
      let candidateList: any[] = [];
      if (Array.isArray(parsed)) {
        candidateList = parsed;
      } else if (parsed && typeof parsed === 'object') {
        const lowerSlug = activeSlug.toLowerCase().trim();
        const ALIASES: Record<string, string[]> = {
          pawzy: ['pawzy', 'pawzy-theme', 'pets', 'pet-store'],
          'pawzy-theme': ['pawzy-theme', 'pawzy', 'pets', 'pet-store'],
          demo: ['demo', 'demo-template', 'funie-demo', 'funo', 'funie'],
          'demo-template': ['demo-template', 'demo', 'funie-demo', 'funo', 'funie'],
          funo: ['funo', 'funie', 'funo-furniture', 'nordic', 'demo'],
          funie: ['funie', 'funo', 'funo-furniture', 'nordic', 'demo'],
          mincom: ['mincom', 'mincom-furniture', 'furniture', 'artisan-craft', 'modern', 'mincom-theme'],
          'artisan-craft': ['artisan-craft', 'mincom', 'furniture', 'modern'],
          nova: ['nova', 'nova-tech', 'electronics', 'tech', 'gadgets'],
          'nova-tech': ['nova-tech', 'nova', 'electronics', 'tech', 'gadgets'],
          luxe: ['luxe', 'luxury', 'velvet-luxury', 'fashion', 'haute-couture'],
          'velvet-luxury': ['velvet-luxury', 'luxe', 'luxury', 'fashion', 'haute-couture'],
          minimal: ['minimal', 'minimalist', 'clean', 'scandinavian'],
          default: ['default', 'general', 'pulse-streetwear', 'botanica-wellness'],
          'pulse-streetwear': ['pulse-streetwear', 'default', 'streetwear'],
          'botanica-wellness': ['botanica-wellness', 'default', 'botanica', 'wellness'],
        };

        const checkKeys = [activeSlug, lowerSlug, ...(ALIASES[lowerSlug] || []), 'all', 'default'];
        for (const k of checkKeys) {
          if (Array.isArray(parsed[k]) && parsed[k].length > 0) {
            candidateList = parsed[k];
            break;
          }
        }

        // If still not matched, check if there's only 1 template key in parsed
        if (candidateList.length === 0) {
          const keys = Object.keys(parsed);
          if (keys.length === 1 && Array.isArray(parsed[keys[0]])) {
            candidateList = parsed[keys[0]];
          }
        }
      }

      if (Array.isArray(candidateList) && candidateList.length > 0) {
        // Filter out disabled sections and map to SectionConfig shape
        const activeList = candidateList
          .filter((s) => s && s.enabled !== false)
          .map((s) => ({
            type: s.type,
            config: s.config || {},
          })) as SectionConfig[];

        if (activeList.length > 0) {
          customSections = activeList;
        }
      }
    } catch (err) {
      console.warn('Failed to parse homeSectionsJson, falling back to default template:', err);
    }
  }

  // Render via SectionResolver if custom sections are saved or if previewing a template in CMS
  const sectionsToRender =
    customSections ||
    (previewTemplate && DEFAULT_TEMPLATE_SECTIONS[activeSlug]
      ? DEFAULT_TEMPLATE_SECTIONS[activeSlug]
      : null);

  if (sectionsToRender && sectionsToRender.length > 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--sf-bg)' }}>
        {Header && <Header />}
        <main className="flex-1">
          <SectionResolver
            sections={sectionsToRender}
            theme={effectiveTheme}
            products={products}
            collections={collections}
            categories={categories}
            templateSlug={activeSlug}
          />
        </main>
        {Footer && <Footer />}
      </div>
    );
  }

  // Otherwise, render the dedicated template-specific HomePage component (e.g. Pawzy, Mincom, Luxe)
  return (
    <FallbackHomePage
      theme={effectiveTheme}
      products={products}
      collections={collections}
      categories={categories}
    />
  );
}
