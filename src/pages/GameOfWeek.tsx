
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PageTransition from '@/components/shared/PageTransition';
import ChessboardComponent from '@/components/ui/ChessboardComponent';

const GameOfWeek = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Sample PGN data for the featured game
  const gamePgn = `
  [Event "Candidates Tournament"]
  [Site "Madrid ESP"]
  [Date "2022.06.17"]
  [Round "1"]
  [White "Nepomniachtchi, Ian"]
  [Black "Rapport, Richard"]
  [Result "1-0"]
  [WhiteElo "2766"]
  [BlackElo "2764"]
  [EventDate "2022.06.16"]
  
  1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 a6 6. Nxc6 bxc6 7. Bd3 d5 8.
  O-O Nf6 9. Re1 Be7 10. e5 Nd7 11. Qg4 g6 12. Bh6 Bf8 13. Bg5 Qc7 14. Rac1 Bg7 
  15. Na4 c5 16. c4 dxc4 17. Bxc4 Qc6 18. Nb6 Nxb6 19. Bxb6 Bb7 20. Bc7 Rc8 21.
  Bd6 O-O 22. h4 f5 23. exf6 Bxf6 24. h5 Rf7 25. hxg6 hxg6 26. Be5 Bxe5 27. Rxe5
  Kg7 28. Re4 Rd7 29. Rg4 Kf6 30. Qh4+ Ke7 31. Rxg6 Qxg6 32. Qh7+ Kd8 33. Qxg6 1-0
  `;
  
  // Commentary for key moves
  const commentary = [
    {
      move: "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 a6",
      comment: "The Sicilian Defense, Najdorf Variation begins. Black aims for a solid yet dynamic position."
    },
    {
      move: "10. e5 Nd7 11. Qg4 g6",
      comment: "White pushes the central pawn and starts an attack on the kingside. Black defends with g6 to prevent immediate threats."
    },
    {
      move: "12. Bh6 Bf8 13. Bg5 Qc7",
      comment: "White's bishop maneuver puts pressure on Black's kingside. The bishop retreats but Black's position is becoming cramped."
    },
    {
      move: "20. Bc7 Rc8 21. Bd6 O-O",
      comment: "The white bishop dominates the center of the board, restricting Black's pieces. Despite the pressure, Black manages to castle."
    },
    {
      move: "24. h5 Rf7 25. hxg6 hxg6 26. Be5",
      comment: "White's kingside attack gains momentum. The pawn exchange opens the h-file, and the bishop repositions to a powerful diagonal."
    },
    {
      move: "29. Rg4 Kf6 30. Qh4+ Ke7 31. Rxg6",
      comment: "The decisive combination. White sacrifices the rook to force the black king into a vulnerable position."
    },
    {
      move: "31... Qxg6 32. Qh7+ Kd8 33. Qxg6 1-0",
      comment: "The final blow. After Qh7+, Black is forced to move the king, allowing White to recapture the queen with decisive material advantage. Black resigns."
    }
  ];
  
  return (
    <PageTransition>
      {/* Header */}
      <div className="pt-24 bg-chess-black text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Game of the Week</h1>
            <p className="text-xl text-gray-300">
              Study masterful chess games with expert analysis and commentary
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Featured Game */}
      <section className="py-16 px-4 bg-white dark:bg-chess-dark">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white dark:bg-chess-dark/50 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 bg-chess-light/30 dark:bg-chess-dark/70 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 bg-chess-accent/10 text-chess-accent border-chess-accent/20">
                    Featured Game
                  </Badge>
                  <h2 className="text-2xl font-bold font-serif">Nepomniachtchi vs. Rapport</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    FIDE Candidates Tournament, Madrid 2022 - Round 1
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <Avatar className="h-14 w-14 border-2 border-chess-accent mb-1">
                      <AvatarImage src="https://images.chessbase.com/images/2019/nepomniachtchi/nepomniachtchi-mugshot-200px.jpg" alt="Ian Nepomniachtchi" />
                      <AvatarFallback>IN</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">Nepomniachtchi</div>
                    <div className="text-xs text-gray-500">2766</div>
                  </div>
                  
                  <div className="text-xl font-bold">vs</div>
                  
                  <div className="text-center">
                    <Avatar className="h-14 w-14 border-2 border-chess-dark mb-1">
                      <AvatarImage src="https://images.chessbase.com/images/2022/rapport/rapport-400px.jpg" alt="Richard Rapport" />
                      <AvatarFallback>RR</AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-medium">Rapport</div>
                    <div className="text-xs text-gray-500">2764</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Interactive Game Viewer</h3>
                  <ChessboardComponent pgn={gamePgn} />
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Game Result</h3>
                    <div className="bg-chess-accent/10 p-4 rounded-md border border-chess-accent/20">
                      <p className="font-medium">1-0 (White wins)</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        A brilliant attacking game by Nepomniachtchi, showcasing his exceptional tactical vision and positional understanding. 
                        The game was a crucial win in the first round of the 2022 Candidates Tournament, which Nepomniachtchi eventually won.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Game Analysis</h3>
                  
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    {commentary.map((item, index) => (
                      <div key={index} className="bg-white dark:bg-chess-dark/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                        <div className="font-mono text-sm mb-2 text-chess-accent">{item.move}</div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{item.comment}</p>
                      </div>
                    ))}
                    
                    <div className="bg-white dark:bg-chess-dark/30 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                      <h4 className="font-medium mb-2">Key Takeaways</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <li>Nepomniachtchi's aggressive kingside play demonstrates the importance of initiative in chess</li>
                        <li>The bishop pair proved to be a decisive advantage in the open position</li>
                        <li>Rapport's defensive resources were exhausted by White's relentless pressure</li>
                        <li>The final combination showcases the power of queen and bishop coordination</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Previous Games */}
      <section className="py-16 px-4 bg-chess-light/50 dark:bg-chess-black">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif mb-4">Previous Featured Games</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our archive of analyzed chess masterpieces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                white: "Magnus Carlsen",
                black: "Fabiano Caruana",
                event: "World Championship 2018",
                date: "November 9, 2018",
                result: "½-½",
                opening: "Queen's Gambit Declined",
                image: "https://images.unsplash.com/photo-1543092587-d8b8feaf362b?q=80&w=2070&auto=format&fit=crop"
              },
              {
                white: "Garry Kasparov",
                black: "Veselin Topalov",
                event: "Wijk aan Zee 1999",
                date: "January 20, 1999",
                result: "1-0",
                opening: "Sicilian Defense",
                image: "https://images.unsplash.com/photo-1560174038-594a6e2e8eaa?q=80&w=2067&auto=format&fit=crop"
              },
              {
                white: "Bobby Fischer",
                black: "Boris Spassky",
                event: "World Championship 1972",
                date: "July 11, 1972",
                result: "1-0",
                opening: "Sicilian Defense, Najdorf",
                image: "https://images.unsplash.com/photo-1582691440518-d0251372b1a3?q=80&w=2071&auto=format&fit=crop"
              }
            ].map((game, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-chess-dark overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${game.image})` }}
                ></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold">{game.white} vs. {game.black}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{game.event}</p>
                    </div>
                    <Badge variant="outline">{game.result}</Badge>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="font-medium w-20">Date:</span>
                      <span className="text-gray-600 dark:text-gray-400">{game.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium w-20">Opening:</span>
                      <span className="text-gray-600 dark:text-gray-400">{game.opening}</span>
                    </div>
                  </div>
                  
                  <button className="text-chess-accent font-medium text-sm inline-flex items-center hover:underline">
                    View analysis
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default GameOfWeek;
