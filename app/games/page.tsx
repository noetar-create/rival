'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

type GameId = 'typing' | 'trivia' | 'reaction' | 'memory' | 'emoji' | 'spot' | 'chess';

// ——— DATA ———
const TYPING_WORDS = ['rival', 'compete', 'winner', 'speed', 'keyboard', 'platform', 'social', 'gaming', 'leaderboard', 'champion', 'victory', 'streak', 'bonus', 'points', 'weekly', 'trophy', 'challenge', 'reaction', 'memory', 'trivia', 'puzzle', 'score', 'ranked', 'battle', 'crown', 'master', 'elite', 'glory', 'rapid', 'swift', 'blazing', 'turbo', 'ultra', 'prime', 'apex', 'nexus', 'pixel', 'blitz', 'clash', 'surge'];

const TRIVIA = [
  { q: "What year was the first iPhone released?", opts: ["2005", "2007", "2009", "2011"], a: 1 },
  { q: "How many sides does a hexagon have?", opts: ["5", "6", "7", "8"], a: 1 },
  { q: "What is the capital of Japan?", opts: ["Seoul", "Beijing", "Tokyo", "Bangkok"], a: 2 },
  { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Jupiter", "Saturn", "Mars"], a: 3 },
  { q: "Who painted the Mona Lisa?", opts: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"], a: 2 },
  { q: "What is the chemical symbol for gold?", opts: ["Ag", "Au", "Fe", "Cu"], a: 1 },
  { q: "How many bones are in the adult human body?", opts: ["196", "206", "216", "226"], a: 1 },
  { q: "What is the fastest land animal?", opts: ["Lion", "Leopard", "Cheetah", "Greyhound"], a: 2 },
  { q: "In what country was chess invented?", opts: ["China", "Greece", "India", "Persia"], a: 2 },
  { q: "What gas do plants absorb from the air?", opts: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], a: 2 },
];

const MEMORY_ITEMS = ['🍎', '🚗', '🌙', '🎸', '🐬', '🌺', '🏆', '🎯', '🦋', '🍕', '⚡', '🎨', '🦁', '🌊', '🔮', '🎲', '🌈', '🦊'];

const EMOJI_PUZZLES = [
  { emojis: '🦁👑', answer: 'lion king', hint: 'Disney movie' },
  { emojis: '🕷️🕸️👨', answer: 'spider-man', hint: 'Marvel hero' },
  { emojis: '❄️👸', answer: 'frozen', hint: 'Elsa...' },
  { emojis: '🐟🔍', answer: 'finding nemo', hint: 'Ocean adventure' },
  { emojis: '🚂⏱️🎸', answer: 'back to the future', hint: 'Time travel classic' },
  { emojis: '🌙🌊👑', answer: 'moana', hint: 'Polynesian princess' },
  { emojis: '🎸🦁👑', answer: 'the lion king', hint: 'Same as first but with music' },
  { emojis: '👻🏠', answer: 'haunted house', hint: 'Spooky place' },
  { emojis: '🐉🏔️🔥', answer: 'dragon mountain fire', hint: 'Fantasy epic' },
  { emojis: '🤖🌌⚔️', answer: 'star wars', hint: 'Long time ago...' },
];

// Chess: 8x8 board, a1 = index 0 bottom-left. We show simplified checkmate-in-1 positions.
const CHESS_PUZZLES = [
  {
    pieces: { e1: '♔', e8: '♚', d8: '♜', h1: '♕' },
    whiteToMove: true,
    winSquare: 'h8',
    movingPiece: 'h1',
    hint: 'Queen to h8 is checkmate',
  },
  {
    pieces: { a8: '♚', a1: '♖', b1: '♖', e1: '♔' },
    whiteToMove: true,
    winSquare: 'a1',
    movingPiece: 'b1',
    hint: "Rook b1 to a1, double rook mate",
  },
];

// ——— GAMES ———

function TypingGame({ onDone }: { onDone: (score: number) => void }) {
  const [words, setWords] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const shuffled = [...TYPING_WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrent(shuffled[0]);
  }, []);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          const finalWpm = Math.round(correct / 0.5); // words per 30s * 2 = per minute
          setWpm(finalWpm);
          onDone(finalWpm);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, correct, onDone]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(' ')) {
      const typed = val.trim();
      if (typed === current) {
        setCorrect(c => c + 1);
        setWords(w => {
          const next = [...w.slice(1), w[0]];
          setCurrent(next[0]);
          return next;
        });
      }
      setInput('');
    } else {
      setInput(val);
    }
  };

  const isMatch = current.startsWith(input) || input === '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <div className="text-4xl font-black text-white">{timeLeft}</div>
          <div className="text-white/40 text-xs">seconds</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-black text-purple-400">{correct}</div>
          <div className="text-white/40 text-xs">words</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-green-400">{correct > 0 ? Math.round(correct / ((30 - timeLeft) / 60)) : 0}</div>
          <div className="text-white/40 text-xs">WPM</div>
        </div>
      </div>

      {/* Word display */}
      <div className="game-area p-6 text-center">
        <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-12">
          {words.slice(0, 8).map((w, i) => (
            <span
              key={i}
              className={`text-lg font-mono px-2 py-1 rounded ${
                i === 0
                  ? 'bg-purple-500/30 text-white font-bold border border-purple-500/50'
                  : 'text-white/30'
              }`}
            >
              {w}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          value={input}
          onChange={handleInput}
          onFocus={() => { if (!started) setStarted(true); }}
          placeholder={started ? '' : 'Click here and start typing...'}
          className={`w-full max-w-xs px-4 py-3 rounded-xl text-center text-lg font-mono outline-none border-2 transition-colors bg-[#0d0d0d] text-white ${
            isMatch ? 'border-purple-500/50' : 'border-red-500/50'
          }`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {!started && (
          <p className="text-white/30 text-sm mt-3">Click the input to start the 30-second timer</p>
        )}
      </div>
    </div>
  );
}

function TriviaGame({ onDone }: { onDone: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setDone(true);
          onDone(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [done, score, onDone]);

  const choose = (optIdx: number) => {
    if (selected !== null || done) return;
    setSelected(optIdx);
    const correct = optIdx === TRIVIA[idx].a;
    if (correct) setScore(s => s + 1);
    setShowResult(true);
    setTimeout(() => {
      if (idx >= TRIVIA.length - 1) {
        setDone(true);
        onDone(score + (correct ? 1 : 0));
      } else {
        setIdx(i => i + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, 800);
  };

  const q = TRIVIA[idx];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="text-white/40 text-sm">Question {idx + 1}/{TRIVIA.length}</div>
        <div className={`text-2xl font-black ${timeLeft < 15 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</div>
        <div className="text-purple-400 font-bold">{score}/{TRIVIA.length}</div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-1.5">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(timeLeft / 60) * 100}%` }} />
      </div>

      <div className="game-area p-6">
        <h3 className="text-white font-bold text-lg mb-5 leading-tight">{q.q}</h3>
        <div className="grid grid-cols-1 gap-3">
          {q.opts.map((opt, i) => {
            let style = 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-purple-500/40';
            if (showResult && i === q.a) style = 'bg-green-500/20 border-green-500/50 text-green-300';
            else if (showResult && i === selected && i !== q.a) style = 'bg-red-500/20 border-red-500/50 text-red-300';
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${style}`}
              >
                <span className="text-white/40 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReactionGame({ onDone }: { onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<'waiting' | 'ready' | 'go' | 'result'>('waiting');
  const [attempt, setAttempt] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAttempt = useCallback(() => {
    setPhase('ready');
    setTooEarly(false);
    const delay = 1000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setPhase('go');
      setStartTime(Date.now());
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === 'waiting') {
      startAttempt();
    } else if (phase === 'ready') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setTooEarly(true);
      setPhase('waiting');
    } else if (phase === 'go') {
      const elapsed = Date.now() - startTime;
      const newTimes = [...times, elapsed];
      setTimes(newTimes);
      if (attempt >= 2) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        setPhase('result');
        onDone(avg);
      } else {
        setAttempt(a => a + 1);
        setPhase('waiting');
      }
    }
  }, [phase, startTime, times, attempt, startAttempt, onDone]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="text-white/40 text-sm">Attempt {Math.min(attempt + 1, 3)}/3</div>
        {times.length > 0 && (
          <div className="text-purple-400 font-bold text-sm">
            Best: {Math.min(...times)}ms
          </div>
        )}
      </div>

      <button
        onClick={handleClick}
        className={`w-full h-48 rounded-2xl font-black text-2xl transition-all duration-100 select-none ${
          phase === 'go'
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/40 scale-[1.02]'
            : phase === 'ready'
            ? 'bg-yellow-600/30 border-2 border-yellow-600/50 text-yellow-300'
            : 'bg-white/5 border-2 border-white/10 text-white/60 hover:bg-white/8'
        }`}
      >
        {phase === 'waiting' && (tooEarly ? '❌ Too early! Click to retry' : attempt === 0 ? '👆 Click to start' : '👆 Click to continue')}
        {phase === 'ready' && '⏳ Wait for green...'}
        {phase === 'go' && '🟢 CLICK NOW!'}
        {phase === 'result' && `Done! Avg: ${Math.round(times.reduce((a, b) => a + b, 0) / times.length)}ms`}
      </button>

      {times.length > 0 && (
        <div className="flex gap-2 justify-center">
          {times.map((t, i) => (
            <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-center">
              <div className="text-white font-bold">{t}ms</div>
              <div className="text-white/40 text-xs">Try {i + 1}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-white/30 text-xs text-center">Click when the box turns green. 3 attempts, lowest average wins.</p>
    </div>
  );
}

function MemoryGame({ onDone }: { onDone: (score: number) => void }) {
  const [phase, setPhase] = useState<'preview' | 'recall' | 'done'>('preview');
  const [target, setTarget] = useState<string[]>([]);
  const [allItems, setAllItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const shuffled = [...MEMORY_ITEMS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 9);
    const distractors = shuffled.slice(9, 18);
    setTarget(targets);
    setAllItems([...targets, ...distractors].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (phase !== 'preview') return;
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setPhase('recall');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const toggle = (item: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const submit = () => {
    let correct = 0;
    selected.forEach(s => { if (target.includes(s)) correct++; });
    setPhase('done');
    onDone(correct);
  };

  return (
    <div className="space-y-5">
      {phase === 'preview' && (
        <>
          <div className="text-center">
            <div className="text-4xl font-black text-purple-400">{countdown}</div>
            <p className="text-white/50 text-sm mt-1">Memorize these 9 items!</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {target.map((item, i) => (
              <div key={i} className="aspect-square flex items-center justify-center text-4xl bg-white/5 rounded-xl border border-white/10">
                {item}
              </div>
            ))}
          </div>
        </>
      )}

      {phase === 'recall' && (
        <>
          <p className="text-white font-semibold text-center">Which items did you see? Tap to select.</p>
          <div className="grid grid-cols-6 gap-2">
            {allItems.map((item, i) => (
              <button
                key={i}
                onClick={() => toggle(item)}
                className={`aspect-square flex items-center justify-center text-2xl rounded-xl transition-all ${
                  selected.has(item)
                    ? 'bg-purple-500/40 border-2 border-purple-400 scale-105'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={submit}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Submit ({selected.size} selected)
          </button>
        </>
      )}

      {phase === 'done' && (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🧠</div>
          <p className="text-white/50">Calculating...</p>
        </div>
      )}
    </div>
  );
}

function EmojiGame({ onDone }: { onDone: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setDone(true);
          onDone(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [done, score, onDone]);

  const submit = () => {
    if (done) return;
    const isCorrect = input.trim().toLowerCase() === EMOJI_PUZZLES[idx].answer.toLowerCase();
    if (isCorrect) setScore(s => s + 1);
    setCorrect(isCorrect);
    setTimeout(() => {
      if (idx >= EMOJI_PUZZLES.length - 1) {
        setDone(true);
        onDone(score + (isCorrect ? 1 : 0));
      } else {
        setIdx(i => i + 1);
        setInput('');
        setCorrect(null);
      }
    }, 800);
  };

  const skip = () => {
    setCorrect(false);
    setTimeout(() => {
      if (idx >= EMOJI_PUZZLES.length - 1) {
        setDone(true);
        onDone(score);
      } else {
        setIdx(i => i + 1);
        setInput('');
        setCorrect(null);
      }
    }, 400);
  };

  const puzzle = EMOJI_PUZZLES[idx];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="text-white/40 text-sm">{idx + 1}/{EMOJI_PUZZLES.length}</div>
        <div className={`text-2xl font-black ${timeLeft < 20 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</div>
        <div className="text-purple-400 font-bold">{score} correct</div>
      </div>

      <div className="game-area p-8 text-center">
        <div className="text-6xl mb-3 tracking-widest">{puzzle.emojis}</div>
        <p className="text-white/40 text-sm mb-4">Hint: {puzzle.hint}</p>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Type your answer..."
          className={`w-full px-4 py-3 rounded-xl text-center text-white bg-[#0d0d0d] border-2 outline-none transition-colors ${
            correct === null ? 'border-white/20' : correct ? 'border-green-500' : 'border-red-500'
          }`}
          autoComplete="off"
        />
        {correct !== null && (
          <p className={`text-sm mt-2 font-semibold ${correct ? 'text-green-400' : 'text-red-400'}`}>
            {correct ? '✓ Correct!' : `✗ Answer: ${puzzle.answer}`}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={skip} className="flex-1 py-2.5 bg-white/10 text-white/60 rounded-xl hover:bg-white/15 font-semibold text-sm transition-colors">
          Skip
        </button>
        <button onClick={submit} className="flex-2 flex-grow py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 font-bold text-sm transition-opacity">
          Submit
        </button>
      </div>
    </div>
  );
}

function SpotGame({ onDone }: { onDone: (score: number) => void }) {
  const differences = [
    { id: 0, label: 'The star is missing', x: 20, y: 20 },
    { id: 1, label: 'Circle is blue (should be red)', x: 60, y: 60 },
    { id: 2, label: 'Square is smaller', x: 75, y: 20 },
    { id: 3, label: 'Extra dot bottom right', x: 80, y: 75 },
    { id: 4, label: 'Triangle is rotated', x: 40, y: 70 },
  ];
  const [found, setFound] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setDone(true);
          onDone(found.size);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const findDiff = (id: number) => {
    if (done) return;
    setFound(prev => {
      const next = new Set(prev);
      next.add(id);
      if (next.size >= differences.length) {
        setDone(true);
        onDone(next.size);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="text-white/40 text-sm">Found: {found.size}/{differences.length}</div>
        <div className={`font-black text-xl ${timeLeft < 15 ? 'text-red-400' : 'text-white'}`}>{timeLeft}s</div>
      </div>

      <p className="text-white/50 text-xs text-center">Click the differences you spot on the RIGHT image</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Original */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a2e] border border-white/10">
          <div className="absolute" style={{ left: '20%', top: '20%' }}>
            <span className="text-yellow-400 text-xl">⭐</span>
          </div>
          <div className="absolute w-10 h-10 rounded-full bg-red-500/80" style={{ left: '55%', top: '55%' }} />
          <div className="absolute w-12 h-12 bg-purple-500/80 rounded" style={{ left: '70%', top: '15%' }} />
          <div className="absolute" style={{ left: '35%', top: '65%' }}>
            <div className="w-0 h-0" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderBottom: '20px solid rgba(34,197,94,0.8)' }} />
          </div>
        </div>

        {/* Modified - click to find differences */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#1a1a2e] border border-white/10 cursor-crosshair">
          {/* Missing star */}
          {!found.has(0) && (
            <div className="absolute" style={{ left: '20%', top: '20%' }} onClick={() => findDiff(0)}>
              {/* Star intentionally missing - just clickable area */}
              <span className="text-transparent text-xl">⭐</span>
            </div>
          )}
          {found.has(0) && <div className="absolute w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center" style={{ left: '18%', top: '18%' }}>✓</div>}

          {/* Blue circle instead of red */}
          <div className="absolute w-10 h-10 rounded-full bg-blue-500/80" style={{ left: '55%', top: '55%' }} onClick={() => findDiff(1)} />
          {found.has(1) && <div className="absolute w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center text-xs" style={{ left: '53%', top: '53%' }}>✓</div>}

          {/* Smaller square */}
          <div className="absolute w-8 h-8 bg-purple-500/80 rounded" style={{ left: '72%', top: '17%' }} onClick={() => findDiff(2)} />
          {found.has(2) && <div className="absolute w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center text-xs" style={{ left: '70%', top: '15%' }}>✓</div>}

          {/* Extra dot */}
          <div className="absolute w-3 h-3 rounded-full bg-pink-400" style={{ left: '78%', top: '73%' }} onClick={() => findDiff(3)} />
          {found.has(3) && <div className="absolute w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center text-xs" style={{ left: '76%', top: '71%' }}>✓</div>}

          {/* Rotated triangle */}
          <div className="absolute" style={{ left: '33%', top: '63%' }} onClick={() => findDiff(4)}>
            <div className="w-0 h-0" style={{ borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid rgba(34,197,94,0.8)' }} />
          </div>
          {found.has(4) && <div className="absolute w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center text-xs" style={{ left: '31%', top: '61%' }}>✓</div>}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {differences.map(d => (
          <div key={d.id} className={`text-center py-1.5 px-1 rounded text-xs font-medium ${found.has(d.id) ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
            {found.has(d.id) ? '✓' : `${d.id + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChessGame({ onDone }: { onDone: (score: number) => void }) {
  const [puzzleIdx] = useState(() => Math.floor(Math.random() * CHESS_PUZZLES.length));
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const puzzle = CHESS_PUZZLES[puzzleIdx];

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const clickSquare = (sq: string) => {
    if (result) return;
    if (!selected) {
      if (puzzle.pieces[sq as keyof typeof puzzle.pieces] && sq === puzzle.movingPiece) {
        setSelected(sq);
      }
    } else {
      if (sq === puzzle.winSquare) {
        setResult('correct');
        onDone(1);
      } else {
        setResult('wrong');
        setTimeout(() => { setSelected(null); setResult(null); }, 800);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
        <p className="text-white/70 text-sm font-medium">♟️ White to move — Find checkmate in 1</p>
        <p className="text-white/40 text-xs mt-1">Hint: {puzzle.hint}</p>
      </div>

      {/* Chess Board */}
      <div className="mx-auto" style={{ maxWidth: '320px' }}>
        <div className="grid grid-cols-8 border border-white/20 rounded-xl overflow-hidden">
          {ranks.map(rank => files.map(file => {
            const sq = `${file}${rank}`;
            const piece = puzzle.pieces[sq as keyof typeof puzzle.pieces];
            const isLight = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 0;
            const isSelected = selected === sq;
            const isWin = sq === puzzle.winSquare;
            const isMoving = sq === puzzle.movingPiece;

            return (
              <div
                key={sq}
                onClick={() => clickSquare(sq)}
                className={`aspect-square flex items-center justify-center text-xl cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? 'bg-yellow-500/60 ring-2 ring-yellow-400'
                    : isWin && selected
                    ? 'bg-green-500/30 ring-1 ring-green-400'
                    : isLight
                    ? 'bg-[#f0d9b5]/20 hover:bg-yellow-500/20'
                    : 'bg-[#b58863]/40 hover:bg-yellow-600/30'
                } ${result === 'correct' && isWin ? 'bg-green-500/60' : ''} ${result === 'wrong' && selected === sq ? 'bg-red-500/40' : ''}`}
              >
                {piece && (
                  <span className={`drop-shadow-md ${isMoving ? 'cursor-grab' : ''}`} title={sq}>
                    {piece}
                  </span>
                )}
              </div>
            );
          }))}
        </div>

        <div className="flex justify-between mt-1">
          {files.map(f => <span key={f} className="text-white/30 text-xs w-10 text-center">{f}</span>)}
        </div>
      </div>

      {result && (
        <div className={`text-center font-bold py-3 rounded-xl ${result === 'correct' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {result === 'correct' ? '♟️ Checkmate! Brilliant!' : '❌ Not quite right, try again'}
        </div>
      )}

      {!selected && (
        <p className="text-white/30 text-xs text-center">Click the white piece you want to move, then click the destination square</p>
      )}
    </div>
  );
}

// ——— GAME CONFIG ———
const GAMES = [
  { id: 'typing' as GameId, title: 'Typing Speed', description: '30 seconds. Type as many words as possible.', icon: '⌨️', gradient: 'from-purple-500 to-indigo-500', winCondition: 'Type 30+ WPM to win 1 point' },
  { id: 'trivia' as GameId, title: 'Trivia Blitz', description: '10 questions, 60 seconds. Multiple choice.', icon: '🧠', gradient: 'from-pink-500 to-rose-500', winCondition: 'Answer 6/10 correctly to win 1 point' },
  { id: 'reaction' as GameId, title: 'Reaction Time', description: 'Click when it turns green. 3 attempts.', icon: '⚡', gradient: 'from-green-500 to-emerald-500', winCondition: 'Average under 350ms to win 1 point' },
  { id: 'memory' as GameId, title: 'Memory Flash', description: '9 items for 3 seconds. Recall as many as you can.', icon: '🎯', gradient: 'from-orange-500 to-amber-500', winCondition: 'Recall 5+ items to win 1 point' },
  { id: 'emoji' as GameId, title: 'Emoji Decode', description: 'Guess the movie/phrase from emoji clues.', icon: '🤔', gradient: 'from-yellow-500 to-orange-500', winCondition: 'Decode 5+ correctly to win 1 point' },
  { id: 'spot' as GameId, title: 'Spot the Difference', description: 'Find differences between two images.', icon: '🔍', gradient: 'from-teal-500 to-cyan-500', winCondition: 'Find 3+ differences to win 1 point' },
  { id: 'chess' as GameId, title: 'Chess Puzzle', description: 'Checkmate in one move. Show your king!', icon: '♟️', gradient: 'from-slate-500 to-gray-600', winCondition: 'Find the winning move to win 1 point' },
];

const WIN_THRESHOLDS: Record<GameId, number> = {
  typing: 30,
  trivia: 6,
  reaction: 350,
  memory: 5,
  emoji: 5,
  spot: 3,
  chess: 1,
};

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [gameResult, setGameResult] = useState<{ score: number; won: boolean; submitted: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [todayWins, setTodayWins] = useState<Set<GameId>>(new Set());

  const handleGameDone = useCallback((gameId: GameId, score: number) => {
    let won = false;
    if (gameId === 'reaction') won = score < WIN_THRESHOLDS[gameId];
    else won = score >= WIN_THRESHOLDS[gameId];
    setGameResult({ score, won, submitted: false });
  }, []);

  const submitScore = async (gameId: GameId) => {
    if (!gameResult || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/games/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_type: gameId, score: gameResult.score }),
      });
      if (res.ok) {
        setGameResult(r => r ? { ...r, submitted: true } : null);
        if (gameResult.won) setTodayWins(prev => new Set([...prev, gameId]));
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } finally {
      setSubmitting(false);
    }
  };

  const gameConfig = GAMES.find(g => g.id === activeGame);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-pulse inline-block" />
          WIN 1 POINT PER GAME • +2 BONUS FOR 8 DIFFERENT GAMES
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Daily Games</h1>
        <p className="text-white/50">Play all 7 games today to unlock the 8-game bonus (+2 pts)</p>
        <p className="text-white/30 text-xs mt-2">
          NO PURCHASE NECESSARY · Skill-based · 18+ · Void where prohibited ·{' '}
          <a href="/rules" className="text-purple-400 hover:text-purple-300 underline">Full rules</a>
        </p>

        {todayWins.size > 0 && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-white/40 text-sm">Today&apos;s wins:</span>
            {[...todayWins].map(g => {
              const cfg = GAMES.find(x => x.id === g);
              return <span key={g} className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-2 py-1 rounded-full">{cfg?.icon} {cfg?.title}</span>;
            })}
          </div>
        )}
      </div>

      {/* Active game */}
      {activeGame && (
        <div className="mb-8">
          <div className={`p-1 rounded-2xl bg-gradient-to-r ${gameConfig?.gradient}`}>
            <div className="bg-[#0d0d0d] rounded-xl p-6">
              {/* Game header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{gameConfig?.icon}</span>
                  <div>
                    <h2 className="text-white font-bold text-lg">{gameConfig?.title}</h2>
                    <p className="text-white/40 text-xs">{gameConfig?.winCondition}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveGame(null); setGameResult(null); }}
                  className="text-white/30 hover:text-white/60 transition-colors text-sm"
                >
                  ✕ Close
                </button>
              </div>

              {/* Game component */}
              {!gameResult ? (
                <>
                  {activeGame === 'typing' && <TypingGame onDone={(s) => handleGameDone('typing', s)} />}
                  {activeGame === 'trivia' && <TriviaGame onDone={(s) => handleGameDone('trivia', s)} />}
                  {activeGame === 'reaction' && <ReactionGame onDone={(s) => handleGameDone('reaction', s)} />}
                  {activeGame === 'memory' && <MemoryGame onDone={(s) => handleGameDone('memory', s)} />}
                  {activeGame === 'emoji' && <EmojiGame onDone={(s) => handleGameDone('emoji', s)} />}
                  {activeGame === 'spot' && <SpotGame onDone={(s) => handleGameDone('spot', s)} />}
                  {activeGame === 'chess' && <ChessGame onDone={(s) => handleGameDone('chess', s)} />}
                </>
              ) : (
                /* Result screen */
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">{gameResult.won ? '🏆' : '💪'}</div>
                  <h3 className={`text-3xl font-black mb-2 ${gameResult.won ? 'text-yellow-400' : 'text-white'}`}>
                    {gameResult.won ? 'You Won!' : 'Nice Try!'}
                  </h3>
                  <p className="text-white/60 mb-2">
                    Score: <span className="text-white font-bold">{activeGame === 'reaction' ? `${gameResult.score}ms` : gameResult.score}</span>
                  </p>
                  {gameResult.won && (
                    <p className="text-green-400 text-sm mb-6">+1 point earned!</p>
                  )}
                  {!gameResult.won && (
                    <p className="text-white/40 text-sm mb-6">{gameConfig?.winCondition}</p>
                  )}

                  {!gameResult.submitted ? (
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => submitScore(activeGame)}
                        disabled={submitting}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : 'Submit Score'}
                      </button>
                      <button
                        onClick={() => setGameResult(null)}
                        className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 font-semibold transition-colors"
                      >
                        Play Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-green-400 font-semibold">✓ Score saved!</p>
                      <button
                        onClick={() => { setActiveGame(null); setGameResult(null); }}
                        className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/15 font-semibold transition-colors"
                      >
                        Back to Games
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Grid */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES.map((game) => {
            const alreadyWon = todayWins.has(game.id);
            return (
              <div
                key={game.id}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group hover:scale-[1.02] ${
                  alreadyWon
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-white/10 hover:border-purple-500/40 bg-[#111111]'
                }`}
                onClick={() => { setActiveGame(game.id); setGameResult(null); }}
              >
                <div className={`h-1 w-full bg-gradient-to-r ${game.gradient}`} />
                {alreadyWon && (
                  <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
                    ✓ Won
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{game.title}</h3>
                      <p className="text-white/40 text-xs mt-0.5">{game.description}</p>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg px-3 py-2 mb-4">
                    <p className="text-green-400 text-xs font-semibold">{game.winCondition}</p>
                  </div>
                  <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 bg-gradient-to-r ${game.gradient} text-white hover:opacity-90`}>
                    {alreadyWon ? 'Play Again' : 'Play Now'} → +1 pt
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
