import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    ArrowLeft,
    ExternalLink,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/shared/PageTransition';
import { useToast } from '@/hooks/use-toast';

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
    registration_required: boolean;
    registration_link?: string;
}

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8000/events/${id}`);
            if (response.ok) {
                const data = await response.json();
                setEvent(data);
            } else {
                toast({
                    title: "Error",
                    description: "Event not found",
                    variant: "destructive"
                });
                navigate('/events');
            }
        } catch (error) {
            console.error("Failed to fetch event details", error);
            toast({
                title: "Error",
                description: "Failed to load event details",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PageTransition>
                <div className="min-h-screen flex items-center justify-center bg-white dark:bg-chess-dark">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chess-accent"></div>
                </div>
            </PageTransition>
        );
    }

    if (!event) {
        return null;
    }

    const eventDate = parseISO(event.date);
    const eventTypeColors: Record<string, string> = {
        tournament: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        practice: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        workshop: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        meeting: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 dark:bg-chess-dark pt-20">
                {/* Back Button */}
                <div className="container mx-auto px-4 pt-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/events')}
                        className="mb-6 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Events
                    </Button>
                </div>

                {/* Hero Section with Image */}
                <div className="relative h-96 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                    <img
                        src={event.image_url || 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1600'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
                        <div className="container mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${eventTypeColors[event.event_type] || 'bg-gray-100 text-gray-800'}`}>
                                    {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2">{event.title}</h1>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
                            >
                                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {event.description || 'No description available'}
                                </p>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24"
                            >
                                <h3 className="text-xl font-bold mb-6">Event Information</h3>

                                <div className="space-y-4">
                                    {/* Date */}
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-chess-accent mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                            <p className="font-semibold">{format(eventDate, 'EEEE, MMMM d, yyyy')}</p>
                                        </div>
                                    </div>

                                    {/* Time */}
                                    {event.time && (
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-5 w-5 text-chess-accent mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                                <p className="font-semibold">{event.time}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Venue */}
                                    {event.venue && (
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-chess-accent mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Venue</p>
                                                <p className="font-semibold">{event.venue}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Participants */}
                                    {event.max_participants && (
                                        <div className="flex items-start gap-3">
                                            <Users className="h-5 w-5 text-chess-accent mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Max Participants</p>
                                                <p className="font-semibold">{event.max_participants} players</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Event Type */}
                                    <div className="flex items-start gap-3">
                                        <Award className="h-5 w-5 text-chess-accent mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Event Type</p>
                                            <p className="font-semibold capitalize">{event.event_type}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Registration Button */}
                                {event.registration_required && event.registration_link && (
                                    <div className="mt-8">
                                        <a
                                            href={event.registration_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full"
                                        >
                                            <Button className="w-full bg-chess-accent hover:bg-chess-accent/90 text-white">
                                                Register Now
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </Button>
                                        </a>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                            Opens in a new tab
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default EventDetails;
