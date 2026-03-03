import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BookOpen, Award, Clock, ChevronRight } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  topics: string[];
  videoUrl?: string;
  articleUrl?: string;
}

const beginnerTutorials: Tutorial[] = [
  {
    id: 'b1',
    title: 'Chess Basics: How Pieces Move',
    description: 'Learn the fundamental movements of each chess piece and the basic rules of the game.',
    level: 'beginner',
    duration: '15 min',
    topics: ['Rules', 'Piece Movement', 'Setup'],
    videoUrl: 'https://www.youtube.com/watch?v=OCSbzArwB10',
    articleUrl: 'https://www.chess.com/learn-how-to-play-chess'
  },
  {
    id: 'b2',
    title: 'Understanding Check, Checkmate, and Stalemate',
    description: 'Master the concepts of check, checkmate, and stalemate with clear examples.',
    level: 'beginner',
    duration: '20 min',
    topics: ['Checkmate', 'Stalemate', 'Game End'],
    videoUrl: 'https://www.youtube.com/watch?v=_CgEkEXQ2cQ',
    articleUrl: 'https://www.chess.com/article/view/how-to-checkmate-in-chess'
  },
  {
    id: 'b3',
    title: 'Basic Opening Principles',
    description: 'Learn the key principles to follow in the opening phase of a chess game.',
    level: 'beginner',
    duration: '25 min',
    topics: ['Opening', 'Development', 'Center Control'],
    videoUrl: 'https://www.youtube.com/watch?v=8IlJ3v8I4Z8',
    articleUrl: 'https://www.chess.com/article/view/the-principles-of-the-opening'
  },
  {
    id: 'b4',
    title: 'Simple Tactics: Forks and Pins',
    description: 'Discover the basic tactical motifs of forks and pins that can win material.',
    level: 'beginner',
    duration: '30 min',
    topics: ['Tactics', 'Forks', 'Pins'],
    videoUrl: 'https://www.youtube.com/watch?v=9mhLQOZKVQs',
    articleUrl: 'https://www.chess.com/article/view/chess-tactics-pin-skewer-fork'
  },
];

const intermediateTutorials: Tutorial[] = [
  {
    id: 'i1',
    title: 'Attacking the King: Common Patterns',
    description: 'Learn recognizable attacking patterns and how to create threats against the opponent\'s king.',
    level: 'intermediate',
    duration: '40 min',
    topics: ['Attack', 'King Safety', 'Sacrifice'],
    videoUrl: 'https://www.youtube.com/watch?v=yv8lgzEm2GQ',
    articleUrl: 'https://www.chess.com/article/view/attacking-the-king'
  },
  {
    id: 'i2',
    title: 'Positional Chess: Pawn Structures',
    description: 'Understand how pawn structures influence your strategy and piece placement.',
    level: 'intermediate',
    duration: '45 min',
    topics: ['Pawns', 'Structure', 'Strategy'],
    videoUrl: 'https://www.youtube.com/watch?v=h-JGqEiNs_c',
    articleUrl: 'https://www.chess.com/article/view/pawn-structures-101-every-opening-pawn-structure'
  },
  {
    id: 'i3',
    title: 'Endgame Essentials: King and Pawn',
    description: 'Master the fundamental king and pawn endgames that form the basis of endgame knowledge.',
    level: 'intermediate',
    duration: '35 min',
    topics: ['Endgame', 'King Activity', 'Promotion'],
    videoUrl: 'https://www.youtube.com/watch?v=3QlBzoNcj8I',
    articleUrl: 'https://www.chess.com/article/view/endgame-fundamentals-king-and-pawn'
  },
  {
    id: 'i4',
    title: 'Tactical Motifs: Discovered Attacks',
    description: 'Learn how to set up and execute powerful discovered attacks and checks.',
    level: 'intermediate',
    duration: '30 min',
    topics: ['Tactics', 'Discovery', 'Double Attack'],
    videoUrl: 'https://www.youtube.com/watch?v=_CgEkEXQ2cQ',
    articleUrl: 'https://www.chess.com/article/view/chess-tactics-the-discovered-attack'
  },
];

const advancedTutorials: Tutorial[] = [
  {
    id: 'a1',
    title: 'Calculation Training: Visualizing Variations',
    description: 'Improve your calculation skills by learning techniques to visualize multiple moves ahead.',
    level: 'advanced',
    duration: '60 min',
    topics: ['Calculation', 'Visualization', 'Planning'],
    videoUrl: 'https://www.youtube.com/watch?v=cY9zitJFKnI',
    articleUrl: 'https://www.chess.com/article/view/how-to-calculate-in-chess'
  },
  {
    id: 'a2',
    title: 'Strategic Imbalances: Exploiting Advantages',
    description: 'Learn how to identify and exploit various types of imbalances in chess positions.',
    level: 'advanced',
    duration: '55 min',
    topics: ['Strategy', 'Imbalances', 'Evaluation'],
    videoUrl: 'https://www.youtube.com/watch?v=LDU83CMkS2Q',
    articleUrl: 'https://www.chess.com/article/view/imbalances-in-chess'
  },
  {
    id: 'a3',
    title: 'Complex Endgames: Rook vs. Minor Pieces',
    description: 'Master the nuances of endgames involving rooks against bishops and knights.',
    level: 'advanced',
    duration: '50 min',
    topics: ['Endgame', 'Rooks', 'Minor Pieces'],
    videoUrl: 'https://www.youtube.com/watch?v=V-zn4u1Q0ZA',
    articleUrl: 'https://www.chess.com/article/view/rook-endgames'
  },
  {
    id: 'a4',
    title: 'Dynamic Play: Piece Sacrifices for Initiative',
    description: 'Study the art of sacrificing material to gain dynamic advantages and initiative.',
    level: 'advanced',
    duration: '45 min',
    topics: ['Dynamics', 'Sacrifice', 'Initiative'],
    videoUrl: 'https://www.youtube.com/watch?v=Ib8XaRKCAfo',
    articleUrl: 'https://www.chess.com/article/view/chess-sacrifices'
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'advanced':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const TutorialCard: React.FC<{ tutorial: Tutorial }> = ({ tutorial }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{tutorial.title}</CardTitle>
          <Badge className={getLevelColor(tutorial.level)} variant="outline">
            {tutorial.level.charAt(0).toUpperCase() + tutorial.level.slice(1)}
          </Badge>
        </div>
        <CardDescription>{tutorial.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm text-gray-500">{tutorial.duration}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tutorial.topics.map((topic, index) => (
            <Badge key={index} variant="secondary">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {tutorial.videoUrl && (
          <Button asChild variant="default" className="w-full">
            <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer">
              Watch Video <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
        {tutorial.articleUrl && (
          <Button asChild variant="outline" className="w-full">
            <a href={tutorial.articleUrl} target="_blank" rel="noopener noreferrer">
              Read Article <BookOpen className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const ChessTutorials: React.FC = () => {
  return (
    <Tabs defaultValue="beginner" className="w-full">
      <div className="flex justify-end items-center mb-6">
        <TabsList>
          <TabsTrigger value="beginner" className="flex items-center">
            <Award className="mr-2 h-4 w-4" /> Beginner
          </TabsTrigger>
          <TabsTrigger value="intermediate" className="flex items-center">
            <Award className="mr-2 h-4 w-4" /> Intermediate
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Award className="mr-2 h-4 w-4" /> Advanced
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="beginner" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beginnerTutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="link" className="text-chess-accent">
            View All Beginner Tutorials <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="intermediate" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {intermediateTutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="link" className="text-chess-accent">
            View All Intermediate Tutorials <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advancedTutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="link" className="text-chess-accent">
            View All Advanced Tutorials <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ChessTutorials;