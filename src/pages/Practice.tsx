import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, Brain, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Practice = () => {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [engineLevel, setEngineLevel] = useState(10); // 1-20
    const [isEngineThinking, setIsEngineThinking] = useState(false);
    const [engineStatus, setEngineStatus] = useState("Ready");
    const [gameOver, setGameOver] = useState(false);
    const engineRef = useRef<Worker | null>(null);

    const gameRef = useRef(game);

    useEffect(() => {
        gameRef.current = game;
    }, [game]);

    // Session Persistence
    useEffect(() => {
        const savedPgn = localStorage.getItem('chessSession');
        if (savedPgn) {
            try {
                const savedGame = new Chess();
                savedGame.loadPgn(savedPgn);
                setGame(savedGame);
                setFen(savedGame.fen());
                if (savedGame.isGameOver()) {
                    setGameOver(true);
                    setEngineStatus("Game Over");
                } else if (savedGame.turn() === 'b') {
                    // Assuming bot is black, we might want to ensure it's not waiting indefinitely if user reloads mid-bot-think
                    // But triggering it immediately might be race-condition prone with worker load.
                    // Ideally handled after worker is ready. 
                    setEngineStatus("Engine Thinking...");
                }
                toast.success("Resumed previous session");
            } catch (e) {
                console.error("Failed to load session", e);
            }
        }
    }, []);

    // Save session on game change
    useEffect(() => {
        if (game.pgn()) {
            localStorage.setItem('chessSession', game.pgn());
        }
    }, [game, fen]);

    useEffect(() => {
        // Initialize Stockfish Worker
        const worker = new Worker('/stockfish.js');
        engineRef.current = worker;

        worker.onmessage = (event) => {
            const line = event.data;

            if (line === 'uciok') {
                if (engineStatus === "Ready") { // Only set if not already thinking/etc
                    setEngineStatus("Engine Ready");
                }
                // Determine if we need to trigger bot move upon reload (if it's black's turn)
                if (gameRef.current.turn() === 'b' && !gameRef.current.isGameOver()) {
                    // Trigger bot
                    setIsEngineThinking(true);
                    setEngineStatus("Engine Thinking...");
                    worker.postMessage(`position fen ${gameRef.current.fen()}`);
                    worker.postMessage('go depth 15');
                }
            }

            if (line.startsWith('bestmove')) {
                const move = line.split(' ')[1];
                if (move) {
                    const currentGame = gameRef.current;
                    const gameCopy = new Chess();
                    gameCopy.loadPgn(currentGame.pgn());

                    try {
                        const result = gameCopy.move({
                            from: move.substring(0, 2),
                            to: move.substring(2, 4),
                            promotion: move.substring(4, 5) || 'q',
                        });

                        if (result) {
                            setGame(gameCopy);
                            setFen(gameCopy.fen());
                            setIsEngineThinking(false);
                            setEngineStatus("Your turn");

                            if (gameCopy.isGameOver()) {
                                setGameOver(true);
                                const result = gameCopy.isCheckmate() ? (gameCopy.turn() === 'w' ? "Black Wins!" : "White Wins!") : "Draw";
                                toast.info(`Game Over: ${result}`);
                                setEngineStatus("Game Over");
                            }
                        }
                    } catch (e) {
                        console.error("Move error:", e);
                    }
                }
            }
        };

        worker.postMessage('uci');

        return () => {
            worker.terminate();
        };
    }, []); // Empty dependency array means this runs once.

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.postMessage(`setoption name Skill Level value ${engineLevel}`);
        }
    }, [engineLevel]);

    function makeAMove(move: { from: string; to: string; promotion?: string }) {
        const gameCopy = new Chess();
        gameCopy.loadPgn(game.pgn());
        try {
            const result = gameCopy.move(move);
            setGame(gameCopy);
            setFen(gameCopy.fen());

            if (gameCopy.isGameOver()) {
                setGameOver(true);
                const result = gameCopy.isCheckmate() ? (gameCopy.turn() === 'w' ? "Black Wins!" : "White Wins!") : "Draw";
                toast.info(`Game Over: ${result}`);
                setEngineStatus("Game Over");
                return null;
            }

            return gameCopy;
        } catch (e) {
            return null;
        }
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        if (game.turn() !== 'w' || isEngineThinking || gameOver) return false;

        const newGame = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });

        if (newGame === null) return false;

        setIsEngineThinking(true);
        setEngineStatus("Engine Thinking...");
        setTimeout(() => {
            if (engineRef.current) {
                engineRef.current.postMessage(`position fen ${newGame.fen()}`);
                engineRef.current.postMessage('go depth 15');
            }
        }, 200);

        return true;
    }

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setIsEngineThinking(false);
        setEngineStatus("New Game Started");
        setGameOver(false);
        localStorage.removeItem('chessSession');
    };

    const resignGame = () => {
        setGameOver(true);
        setEngineStatus("You Resigned. Black Wins!");
        toast.info("You Resigned.");
    };

    return (
        <div className="w-full">
            {/* Header - Simple Animation only opacity to avoid transform issues */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="pt-24 bg-chess-black text-white"
            >
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Practice with Bot</h1>
                        <p className="text-xl text-gray-300">
                            Challenge our AI bot running directly in your browser
                        </p>
                    </div>
                </div>
                <div className="h-20 bg-white dark:bg-chess-dark"></div>
            </motion.div>

            {/* Main Content */}
            <section className="py-8 px-4 bg-white dark:bg-chess-dark">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Board Area */}
                        <div className="lg:col-span-2 lg:order-1 order-1 flex justify-center items-start">
                            <Card className="overflow-hidden border-none shadow-xl w-full max-w-[70vh] aspect-square">
                                <div className="w-full h-full bg-white/5 p-1 rounded-sm">
                                    <Chessboard
                                        position={fen}
                                        onPieceDrop={onDrop}
                                        boardOrientation="white"
                                        customDarkSquareStyle={{ backgroundColor: '#779954' }}
                                        customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
                                        animationDuration={200}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Controls Panel */}
                        <div className="lg:col-span-1 space-y-6 lg:order-2 order-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-6 h-6 text-chess-accent" />
                                        Settings
                                    </CardTitle>
                                    <CardDescription>Configure your opponent</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-medium">Difficulty (Level {engineLevel})</label>
                                            <span className="text-xs text-muted-foreground">{engineLevel < 10 ? 'Beginner' : engineLevel < 15 ? 'Intermediate' : 'Master'}</span>
                                        </div>
                                        <Slider
                                            value={[engineLevel]}
                                            onValueChange={(val) => setEngineLevel(val[0])}
                                            min={0} max={20} step={1}
                                            disabled={isEngineThinking || gameOver}
                                        />
                                    </div>

                                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className={`font-semibold ${isEngineThinking ? 'text-amber-500' : 'text-green-500'}`}>
                                                {engineStatus}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Turn:</span>
                                            <span className="font-semibold">{game.turn() === 'w' ? 'White (You)' : 'Black (Bot)'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button onClick={resetGame} variant="outline" className="flex-1">
                                            <RotateCcw className="w-4 h-4 mr-2" /> New Game
                                        </Button>
                                        <Button onClick={resignGame} variant="destructive" className="flex-1" disabled={gameOver}>
                                            <Flag className="w-4 h-4 mr-2" /> Resign
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Move History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-48 overflow-y-auto font-mono text-sm bg-muted/30 p-2 rounded border">
                                        {game.history().map((move, i) => (
                                            <span key={i} className={`inline-block mr-2 ${i % 2 === 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                                                {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}{move}
                                            </span>
                                        ))}
                                        {game.history().length === 0 && <span className="text-muted-foreground italic">No moves yet...</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Practice;
