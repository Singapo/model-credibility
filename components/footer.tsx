export function Footer() {
  const commitHash = process.env.NEXT_PUBLIC_GIT_COMMIT_HASH || "dev";
  const repoUrl = "https://github.com/Singapo/model-credibility";

  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div>© 2025 ModelCred · 公开数据，社区共治</div>
          <div className="text-xs">
            数据快照锚定于 GitHub commit{" "}
            <a
              href={`${repoUrl}/commit/${commitHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono hover:text-foreground"
            >
              {commitHash}
            </a>
          </div>
        </div>
        <div className="flex gap-6">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a href="#" className="hover:text-foreground">
            算法说明
          </a>
          <a href="#" className="hover:text-foreground">
            免责声明
          </a>
        </div>
      </div>
    </footer>
  );
}
