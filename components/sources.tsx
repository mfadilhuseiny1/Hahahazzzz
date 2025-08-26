interface Source {
  title: string;
  url: string;
  snippet?: string;
}

interface SourcesProps {
  sources: Source[];
}

export function Sources({ sources }: SourcesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-muted/50 rounded-lg border">
      <h4 className="text-sm font-medium mb-2 text-muted-foreground">Sources</h4>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 p-2 rounded hover:bg-muted/50 transition-colors"
          >
            <svg className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{source.title}</div>
              {source.snippet && (
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {source.snippet}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}