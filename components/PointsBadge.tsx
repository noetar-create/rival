interface PointsBadgeProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function PointsBadge({ points, size = 'md', animated = false }: PointsBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 ${sizes[size]} ${animated ? 'animate-pulse' : ''}`}
    >
      <span>⚡</span>
      <span>{points} pts</span>
    </span>
  );
}
