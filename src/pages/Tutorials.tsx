import React, { useEffect } from 'react';
import ChessTutorials from '@/components/chess/ChessTutorials';
import PageTransition from '@/components/shared/PageTransition';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

const Tutorials: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      {/* Header */}
      <div className="pt-24 bg-chess-black text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Chess Tutorials</h1>
            <p className="text-lg text-gray-300">
              Enhance your chess skills with our comprehensive collection of tutorials,
              designed for players of all levels from beginners to advanced.
            </p>
          </div>
        </div>
        <div className="h-20 bg-white dark:bg-chess-dark chess-board-pattern"></div>
      </div>

      {/* Content */}
      <section className="py-16 px-4 bg-white dark:bg-chess-dark">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                    <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-xl font-semibold">Structured Learning</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Follow our carefully organized tutorials that build upon each other,
                  creating a solid foundation for your chess knowledge.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                    <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <h3 className="text-xl font-semibold">Skill Progression</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Track your progress as you advance from basic concepts to complex
                  strategies and tactics used by chess masters.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <h3 className="text-xl font-semibold">Community Support</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Join our chess community where you can discuss concepts, ask questions,
                  and get feedback on your games from fellow members.
                </p>
              </div>
            </div>

            {/* Tutorials Component */}
            <ChessTutorials />
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Tutorials;