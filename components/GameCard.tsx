'use client';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  winCondition: string;
  onPlay: (id: string) => void;
}

export default function GameCard({ id, title, description, icon, gradient, winCondition, onPlay }: GameCardProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/40 bg-[#111111]`}
         onClick={() => onPlay(id)}>
      {/* Gradient top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Icon and title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-bold text-base">{title}</h3>
            <p className="text-white/50 text-xs mt-0.5">{description}</p>
          </div>
        </div>

        {/* Win condition */}
        <div className="bg-white/5 rounded-lg px-3 py-2 mb-4">
          <p className="text-white/40 text-xs">Win condition</p>
          <p className="text-green-400 text-xs font-semibold mt-0.5">{winCondition}</p>
        </div>

        {/* Play button */}
        <button
          className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg`}
        >
          Play Now → +1 pt
        </button>
      </div>
    </div>
  );
}
