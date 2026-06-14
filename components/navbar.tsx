import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            M
          </span>
          ModelCred
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/" className="hover:text-foreground">厂商榜</Link>
          <Link href="/" className="hover:text-foreground">模型榜</Link>
          <Link href="/" className="hover:text-foreground">事故</Link>
          <Link href="/" className="hover:text-foreground">吐槽</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button size="sm">提交评分</Button>
        </div>
      </div>
    </header>
  );
}
