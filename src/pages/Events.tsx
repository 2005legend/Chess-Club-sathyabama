
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isFuture, isPast } from 'date-fns';
import { Calendar as CalendarIcon, Filter, CalendarDays } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/shared/PageTransition';
import EventCard from '@/components/shared/EventCard';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  event_type: string;
  image_url?: string;
  max_participants?: number;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/events');
      if (response.ok) {
        setEvents(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  // State for filters
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');

  // Filtered events
  const filteredEvents = events.filter(event => {
    const eventDate = parseISO(event.date);

    // Filter by selected date
    if (date && format(eventDate, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd')) {
      return false;
    }

    // Filter by tab
    if (activeTab === 'upcoming' && !isFuture(eventDate)) {
      return false;
    }

    if (activeTab === 'past' && !isPast(eventDate)) {
      return false;
    }

    return true;
  });

  // Sort events by date, most recent first
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (activeTab === 'past') {
      return parseISO(b.date).getTime() - parseISO(a.date).getTime();
    }
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

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
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">Events & Tournaments</h1>
            <p className="text-xl text-gray-300">
              Stay updated with our chess events, tournaments, and activities
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <section className="py-8 px-4 bg-chess-light/50 dark:bg-chess-dark border-b border-gray-200 dark:border-gray-800 sticky top-16 z-10 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarIcon size={16} />
                    {date ? format(date, 'PP') : 'Filter by date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {date && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDate(undefined)}
                  className="text-chess-accent"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid or Empty State */}
      <section className="py-16 px-4 bg-white dark:bg-chess-dark">
        <div className="container mx-auto">
          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <EventCard
                    id={event.id}
                    title={event.title}
                    date={format(parseISO(event.date), 'MMM d, yyyy')}
                    location={event.venue || 'TBA'}
                    participants={event.max_participants || 0}
                    image={event.image_url || 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=800'}
                    upcoming={isFuture(parseISO(event.date))}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <CalendarDays className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Event information coming soon</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                We're currently planning our upcoming chess events and tournaments.
                Check back later to see our schedule!
              </p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Events;
