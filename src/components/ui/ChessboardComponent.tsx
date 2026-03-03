
import { useState, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, X, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ChessboardComponentProps {
  fen?: string;
  pgn?: string;
  puzzleMode?: boolean;
  solution?: string[];
  onPuzzleSolved?: () => void;
}

const ChessboardComponent = ({ 
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 
  pgn = '',
  puzzleMode = false,
  solution = [], 
  onPuzzleSolved 
}: ChessboardComponentProps) => {
  const [game, setGame] = useState(new Chess(fen));
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [showHint, setShowHint] = useState(false);
  
  // Load pgn if provided
  useEffect(() => {
    if (pgn) {
      try {
        const newGame = new Chess();
        newGame.loadPgn(pgn);
        setGame(newGame);
        
        // Extract moves history
        const history = newGame.history({ verbose: true });
        setMoves(history.map(move => `${move.from}${move.to}`));
        setCurrentMoveIndex(-1);
      } catch (e) {
        console.error('Error loading PGN:', e);
      }
    } else if (fen) {
      try {
        setGame(new Chess(fen));
      } catch (e) {
        console.error('Error loading FEN:', e);
      }
    }
  }, [pgn, fen]);

  // Handle user move
  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    try {
      // Try to make the move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      // If the move is invalid
      if (!move) return false;
      
      // Update the game state
      setGame(new Chess(game.fen()));
      
      if (puzzleMode) {
        // Track user moves for puzzle solving
        const moveString = `${sourceSquare}${targetSquare}`;
        setUserMoves(prev => [...prev, moveString]);
        
        // Check if the move is correct (first move in solution)
        if (solution.length > 0 && moveString === solution[0]) {
          // If there's only one move in the solution, puzzle is solved
          if (solution.length === 1) {
            toast({
              title: "Correct!",
              description: "You've solved the puzzle!",
              duration: 3000,
            });
            if (onPuzzleSolved) onPuzzleSolved();
          } else {
            // Make the opponent's move (second move in solution)
            if (solution.length > 1) {
              const opponentMove = solution[1];
              const from = opponentMove.substring(0, 2);
              const to = opponentMove.substring(2, 4);
              
              setTimeout(() => {
                game.move({
                  from,
                  to,
                  promotion: 'q',
                });
                setGame(new Chess(game.fen()));
                
                // Update solution to remaining moves
                solution.splice(0, 2);
              }, 500);
            }
          }
        } else if (solution.length > 0) {
          // Wrong move
          toast({
            title: "Try again",
            description: "That's not the correct move for this puzzle.",
            variant: "destructive",
            duration: 3000,
          });
          
          // Reset to initial position
          setTimeout(() => {
            setGame(new Chess(fen));
            setUserMoves([]);
          }, 1000);
        }
      }
      
      return true;
    } catch (e) {
      console.error('Invalid move:', e);
      return false;
    }
  }, [game, puzzleMode, solution, fen, onPuzzleSolved]);
  
  // Navigation functions for PGN viewer
  const goToStart = () => {
    const newGame = new Chess();
    if (pgn) newGame.loadPgn(pgn);
    else newGame.load(fen);
    setGame(newGame);
    setCurrentMoveIndex(-1);
  };
  
  const goToPrevMove = () => {
    if (currentMoveIndex >= 0) {
      const newGame = new Chess();
      if (pgn) newGame.loadPgn(pgn);
      else newGame.load(fen);
      
      for (let i = 0; i <= currentMoveIndex - 1; i++) {
        const from = moves[i].substring(0, 2);
        const to = moves[i].substring(2, 4);
        newGame.move({ from, to, promotion: 'q' });
      }
      
      setGame(newGame);
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  };
  
  const goToNextMove = () => {
    if (currentMoveIndex < moves.length - 1) {
      const newIndex = currentMoveIndex + 1;
      const from = moves[newIndex].substring(0, 2);
      const to = moves[newIndex].substring(2, 4);
      
      game.move({ from, to, promotion: 'q' });
      setGame(new Chess(game.fen()));
      setCurrentMoveIndex(newIndex);
    }
  };
  
  const goToEnd = () => {
    const newGame = new Chess();
    if (pgn) newGame.loadPgn(pgn);
    else newGame.load(fen);
    
    moves.forEach(move => {
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      newGame.move({ from, to, promotion: 'q' });
    });
    
    setGame(newGame);
    setCurrentMoveIndex(moves.length - 1);
  };
  
  const flipBoard = () => {
    setBoardOrientation(prev => prev === 'white' ? 'black' : 'white');
  };
  
  const showHintToast = () => {
    if (solution.length > 0) {
      const from = solution[0].substring(0, 2);
      setShowHint(true);
      toast({
        title: "Hint",
        description: `Try moving the piece on ${from.toUpperCase()}`,
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-xl overflow-hidden shadow-lg border border-chess-light dark:border-chess-dark">
        <Chessboard 
          position={game.fen()} 
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation}
          areArrowsAllowed={true}
          customBoardStyle={{
            borderRadius: '0.5rem',
          }}
          customDarkSquareStyle={{ backgroundColor: '#BE3455' }}
          customLightSquareStyle={{ backgroundColor: '#F8F9FA' }}
          customPieces={{
            // Custom styling for pieces if needed
          }}
          showBoardNotation={true}
        />
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {!puzzleMode && pgn && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToStart} 
              disabled={currentMoveIndex === -1}
              className="flex items-center gap-1"
            >
              <RotateCcw size={14} />
              Start
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPrevMove} 
              disabled={currentMoveIndex === -1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextMove} 
              disabled={currentMoveIndex === moves.length - 1}
            >
              Next
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToEnd} 
              disabled={currentMoveIndex === moves.length - 1}
              className="flex items-center gap-1"
            >
              End
              <ArrowRight size={14} />
            </Button>
          </>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={flipBoard}
        >
          Flip Board
        </Button>
        
        {puzzleMode && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={showHintToast}
            className="flex items-center gap-1"
          >
            <HelpCircle size={14} />
            Hint
          </Button>
        )}
      </div>
      
      {showHint && solution.length > 0 && (
        <div className="mt-4 bg-chess-accent/10 p-2 rounded-md border border-chess-accent/20">
          <p className="text-sm text-center text-chess-accent">
            Try moving the piece on {solution[0].substring(0, 2).toUpperCase()}
          </p>
        </div>
      )}
      
      {puzzleMode && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Find the best move for {game.turn() === 'w' ? 'white' : 'black'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChessboardComponent;
