interface FooterProps {
  brandName: string;
}

export function Footer({ brandName }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cyan-500/20 dark:border-cyan-400/15 bg-white/85 dark:bg-[#040816]/90 backdrop-blur-md py-8 transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <p>
          © <span className="tabular-nums">{year}</span> {brandName}. All rights reserved.
        </p>

        <a href="#top" className="text-cyan-700 dark:text-cyan-300/80 hover:text-cyan-500 dark:hover:text-cyan-200 transition-colors">
          Back to top
        </a>
      </div>
    </footer>
  );
}
