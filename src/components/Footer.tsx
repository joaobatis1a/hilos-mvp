import { siteConfig } from "@/lib/site";

const YEAR = 2026;

export function Footer() {
  return (
    <footer className="bg-ink py-10 text-cream/70">
      <div className="container-hilos flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-cream">HILOS</p>
          <p className="eyebrow mt-1 text-cream/50">HILOS • Pernambuco</p>
        </div>
        <div className="eyebrow flex flex-wrap gap-x-6 gap-y-2 text-cream/60">
          <span>{siteConfig.instagramHandle}</span>
          <span>© {YEAR} HILOS</span>
        </div>
      </div>
    </footer>
  );
}
