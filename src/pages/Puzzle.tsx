
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshCw, ThumbsUp, Trophy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import PageTransition from '@/components/shared/PageTransition';
import ChessboardComponent from '@/components/ui/ChessboardComponent';
import { Chess } from 'chess.js';

interface Puzzle {
  id: string; // Lichess uses string IDs
  title: string;
  fen: string;
  solution: string[];
  rating: number;
  themes: string[];
  date: string;
}

const Puzzle = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDailyPuzzle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://lichess.org/api/puzzle/daily');
      if (!response.ok) throw new Error("Failed to fetch from Lichess");

      const data = await response.json();

      // Process Lichess Data
      const pgn = data.game.pgn;
      const initialPly = data.puzzle.initialPly;
      const solution = data.puzzle.solution;

      // Calculate start FEN
      const chess = new Chess();
      chess.loadPgn(pgn);

      // We need to traverse to the initialPly
      // chess.js loads the entire game. We want the state at initialPly.
      // Easiest is to get history, reset, and replay.
      const history = chess.history({ verbose: true });

      const tempGame = new Chess();
      for (let i = 0; i < initialPly; i++) {
        if (history[i]) {
          tempGame.move(history[i]);
        }
      }

      const startFen = tempGame.fen();
      const turn = tempGame.turn() === 'w' ? 'White' : 'Black';

      setPuzzle({
        id: data.puzzle.id,
        title: `Daily Puzzle: ${turn} to Play`,
        fen: startFen,
        solution: solution,
        rating: data.puzzle.rating,
        themes: data.puzzle.themes,
        date: format(new Date(), 'MMMM d, yyyy')
      });
      setIsSolved(false);

    } catch (error) {
      console.error("Failed to load puzzle", error);
      toast({
        title: "Error",
        description: "Failed to load daily puzzle from Lichess.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyPuzzle();
  }, []);

  const handlePuzzleSolved = () => {
    setIsSolved(true);
    // Trigger confetti or sound here if desired
  };

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chess-accent"></div>
          <p className="text-gray-500">Loading today's challenge...</p>
        </div>
      </div>
    );
  }

  if (!puzzle) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-24 bg-chess-black text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Daily Chess Puzzle</h1>
            <p className="text-xl text-gray-300">
              Challenge yourself with the official Lichess Daily Puzzle
            </p>
          </motion.div>
        </div>
      </div>

      {/* Active Puzzle Section */}
      <section className="py-16 px-4 bg-white dark:bg-chess-dark">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white dark:bg-chess-dark/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

            {/* Puzzle Header */}
            <div className="p-6 bg-chess-light/30 dark:bg-chess-dark/70 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold font-serif flex items-center gap-3">
                  <Trophy className="text-amber-500" />
                  {puzzle.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Lichess Rating: {puzzle.rating}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">{puzzle.date}</span>
                <div className="flex gap-2 mt-2">
                  {puzzle.themes.slice(0, 3).map(theme => (
                    <span key={theme} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-md capitalize">
                      {theme.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Board Area */}
                <div className="lg:col-span-2 flex justify-center">
                  <div className="w-full max-w-[600px]">
                    <ChessboardComponent
                      fen={puzzle.fen}
                      puzzleMode={true}
                      solution={puzzle.solution}
                      onPuzzleSolved={handlePuzzleSolved}
                    />
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                    <h3 className="font-bold text-lg mb-3 text-blue-800 dark:text-blue-300">Your Goal</h3>
                    <p className="text-blue-700 dark:text-blue-400">
                      Find the best move for <strong>{puzzle.title.includes('White') ? 'White' : 'Black'}</strong>.
                    </p>
                  </div>

                  {isSolved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800 text-center"
                    >
                      <ThumbsUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-bold text-xl text-green-800 dark:text-green-300 mb-2">Puzzle Solved!</h3>
                      <p className="text-green-700 dark:text-green-400 mb-4">Great job finding the tactical sequence.</p>
                      <Button onClick={() => window.open(`https://lichess.org/training/${puzzle.id}`, '_blank')} variant="outline" className="w-full">
                        View on Lichess <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 p-2">
                    <p className="text-xs text-gray-500 text-center">
                      Powered by <a href="https://lichess.org" target="_blank" className="underline hover:text-chess-accent">Lichess API</a>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Puzzle;
