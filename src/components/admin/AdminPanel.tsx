import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, Trophy, Target,
  Edit, Trash, Plus, LogOut, Puzzle, Gamepad2,
  LayoutDashboard, Settings, Image as ImageIcon,
  ChevronRight, Upload, Download, Search, Bot, Play, Square, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Chess } from 'chess.js';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  event_type: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
  image_url?: string;
}

interface Puzzle {
  id: number;
  title: string;
  fen: string;
  solution: string[];
  difficulty: string;
  theme?: string;
  date?: string;
}

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [events, setEvents] = useState<Event[]>([]);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

  // Bot State
  const [botStatus, setBotStatus] = useState("Stopped");
  const [botConfig, setBotConfig] = useState({ token: '', engine: '' });

  // Forms state
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // File Upload State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    event_type: 'tournament',
    image_url: ''
  });

  const [puzzleForm, setPuzzleForm] = useState({
    title: '',
    fen: '',
    solution: '',
    difficulty: 'Medium',
    theme: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: passwordForm.newPassword })
      });

      if (response.ok) {
        toast.success("Password updated successfully");
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const token = localStorage.getItem('adminToken');

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8000/events');
      if (response.ok) {
        setEvents(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch events");
    }
  };

  const fetchPuzzles = async () => {
    try {
      const response = await fetch('http://localhost:8000/puzzles');
      if (response.ok) {
        setPuzzles(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch puzzles");
    }
  };

  const fetchBotStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/bot/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBotStatus(data.status);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchEvents();
    fetchPuzzles();
    if (activeTab === 'bot') {
      fetchBotStatus();
      // Fetch config
      fetch('http://localhost:8000/bot/config', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()).then(data => {
        setBotConfig({
          token: data.token || '',
          engine: (data.engine && data.engine.name) ? data.engine.name : (data.engine || '')
        });
      });
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminAuthenticated');
    window.location.href = '/admin-login';
  };

  // ==================== BOT HANDLERS ====================
  const handleBotStart = async () => {
    try {
      const res = await fetch('http://localhost:8000/bot/start', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'Started' || data.status === 'Already running') {
        toast.success("Bot Started");
        setBotStatus("Running");
      } else {
        toast.error(data.message || "Failed to start");
      }
    } catch (e) { toast.error("Error starting bot"); }
  };

  const handleBotStop = async () => {
    try {
      await fetch('http://localhost:8000/bot/stop', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success("Bot Stopped");
      setBotStatus("Stopped");
    } catch (e) { toast.error("Error stopping bot"); }
  };

  const handleSaveBotConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8000/bot/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(botConfig)
      });
      toast.success("Configuration Saved");
    } catch (e) { toast.error("Failed to save config"); }
  };

  // ==================== EVENT LOGIC ====================

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isEditing && currentId
      ? `http://localhost:8000/events/${currentId}`
      : 'http://localhost:8000/events';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      // 1. Prepare payload - ensure all fields are properly formatted
      let timeValue: string | undefined = undefined;
      if (eventForm.time && eventForm.time.trim()) {
        // Ensure time is in HH:MM:SS format
        if (eventForm.time.length === 5) {
          timeValue = eventForm.time + ':00';
        } else if (eventForm.time.length === 8) {
          timeValue = eventForm.time;
        } else {
          timeValue = eventForm.time;
        }
      }

      const payload: any = {
        title: eventForm.title.trim(),
        date: eventForm.date,
        event_type: eventForm.event_type,
        registration_required: false
      };

      // Only include optional fields if they have values (convert empty strings to null)
      if (eventForm.description && eventForm.description.trim()) {
        payload.description = eventForm.description.trim();
      }
      if (timeValue) {
        payload.time = timeValue;
      }
      if (eventForm.venue && eventForm.venue.trim()) {
        payload.venue = eventForm.venue.trim();
      }
      if (eventForm.image_url && eventForm.image_url.trim()) {
        payload.image_url = eventForm.image_url.trim();
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = `Failed to save event: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Event creation error:', errorData);
          
          // Handle validation errors (422)
          if (response.status === 422 && errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              const validationErrors = errorData.detail.map((err: any) => 
                `${err.loc?.join('.')}: ${err.msg}`
              ).join(', ');
              errorMessage = `Validation error: ${validationErrors}`;
            } else {
              errorMessage = errorData.detail;
            }
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
          // If JSON parsing fails, use status text
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const savedEvent = await response.json();
      const eventId = savedEvent.id;

      // 2. Upload Image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const uploadRes = await fetch(`http://localhost:8000/events/${eventId}/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData // Content-Type handled automatically
        });

        if (!uploadRes.ok) {
          const uploadError = await uploadRes.json().catch(() => ({ detail: uploadRes.statusText }));
          console.error('Image upload error:', uploadError);
          toast.error("Event saved but image upload failed");
        }
      }

      toast.success("Event saved successfully");
      fetchEvents();
      setShowForm(false);
      resetForms();
    } catch (error) {
      console.error('Event submission error:', error);
      const errorMessage = error instanceof Error ? error.message : "Operation failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:8000/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchEvents();
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // ==================== PUZZLE LOGIC ====================

  const handleLichessImport = async () => {
    setIsLoading(true);
    toast.info("Fetching daily puzzle from Lichess...");
    try {
      const response = await fetch('https://lichess.org/api/puzzle/daily');
      if (!response.ok) throw new Error("Failed to fetch from Lichess");

      const data = await response.json();
      const pgn = data.game.pgn;
      const solution = data.puzzle.solution; // array of strings
      const themes = data.puzzle.themes;
      const initialPly = data.puzzle.initialPly;

      // Parse PGN to get FEN
      const chess = new Chess();
      chess.loadPgn(pgn);

      const history = chess.history({ verbose: true });
      const tempGame = new Chess();
      for (let i = 0; i < initialPly; i++) {
        if (history[i]) {
          tempGame.move(history[i]);
        }
      }

      setPuzzleForm({
        title: `Lichess Daily: ${data.puzzle.id}`,
        fen: tempGame.fen(),
        solution: solution.join(', '),
        difficulty: 'Hard', // Daily puzzles vary, default to Hard
        theme: themes.join(', ')
      });

      toast.success("Imported successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to import from Lichess");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePuzzleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // logic same as before...
    const url = isEditing ? `http://localhost:8000/puzzles/${currentId}` : 'http://localhost:8000/puzzles';
    const method = isEditing ? 'PUT' : 'POST';
    const solutionArray = puzzleForm.solution.split(',').map(s => s.trim()).filter(s => s);

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...puzzleForm, solution: solutionArray })
      });
      toast.success("Puzzle saved");
      fetchPuzzles();
      setShowForm(false);
      resetForms();
    } catch (error) {
      toast.error("Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePuzzle = async (id: number) => {
    if (!confirm("Delete this puzzle?")) return;
    try {
      await fetch(`http://localhost:8000/puzzles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchPuzzles();
      toast.success("Deleted");
    } catch (e) { toast.error("Error"); }
  };

  // ==================== UTILS ====================

  const resetForms = () => {
    setIsEditing(false);
    setCurrentId(null);
    setSelectedImage(null);
    setEventForm({ title: '', description: '', date: '', time: '', venue: '', event_type: 'tournament', image_url: '' });
    setPuzzleForm({ title: '', fen: '', solution: '', difficulty: 'Medium', theme: '' });
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === id
        ? 'bg-chess-accent text-white shadow-lg'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-chess-dark flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-chess-dark/80 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-chess-accent rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-chess-dark dark:text-white">ChessAdmin</span>
          </div>

          <nav className="space-y-2">
            <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
            <NavItem id="events" icon={Calendar} label="Events" />
            <NavItem id="puzzles" icon={Gamepad2} label="Puzzles" />
            <NavItem id="bot" icon={Bot} label="Lichess Bot" />
            <NavItem id="settings" icon={Settings} label="Settings" />
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Logged in as</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">Admin</p>
            </div>
            <Button variant="destructive" className="w-full flex items-center gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                {activeTab}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage your club's {activeTab}
              </p>
            </div>
          </header>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
                { label: 'Total Puzzles', value: puzzles.length, icon: Puzzle, color: 'text-purple-600', bg: 'bg-purple-100' },
                { label: 'Bot Status', value: botStatus, icon: Bot, color: botStatus === 'Running' ? 'text-green-600' : 'text-gray-600', bg: botStatus === 'Running' ? 'bg-green-100' : 'bg-gray-100' },
                { label: 'Admin Users', value: 1, icon: Target, color: 'text-amber-600', bg: 'bg-amber-100' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-full ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => { resetForms(); setShowForm(true); }} className="bg-chess-accent hover:bg-chess-accent/90">
                  <Plus className="w-4 h-4 mr-2" /> New Event
                </Button>
              </div>

              {showForm && (
                <Card className="border-2 border-chess-accent/10 shadow-xl">
                  <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</CardTitle>
                    <CardDescription>Fill in the details below. Supported image formats: JPG, PNG.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleEventSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Event Title</Label>
                          <Input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={eventForm.event_type} onValueChange={v => setEventForm({ ...eventForm, event_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tournament">Tournament</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                              <SelectItem value="practice">Practice</SelectItem>
                              <SelectItem value="meeting">Meeting</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input type="time" value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Venue</Label>
                        <Input value={eventForm.venue} onChange={e => setEventForm({ ...eventForm, venue: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image-upload">Event Poster (Optional)</Label>
                        <div className="flex flex-col gap-4">
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedImage(e.target.files ? e.target.files[0] : null)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer file:cursor-pointer file:text-chess-accent file:font-semibold"
                          />
                          {selectedImage && (
                            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="w-full h-full object-contain"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6"
                                onClick={() => {
                                  setSelectedImage(null);
                                  // Reset the input value finding element by ID
                                  const input = document.getElementById('image-upload') as HTMLInputElement;
                                  if (input) input.value = '';
                                }}
                              >
                                <Trash className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          {!selectedImage && eventForm.image_url && (
                            <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={eventForm.image_url}
                                alt="Current"
                                className="w-full h-full object-contain"
                              />
                              <p className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Current Image</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={4} value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} required />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        <Button type="submit" className="bg-chess-accent" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Event'}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-all group">
                    <div className="h-48 bg-gray-100 dark:bg-gray-800 relative">
                      {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => {
                          setIsEditing(true); setCurrentId(event.id);
                          setEventForm({ ...event, image_url: event.image_url || '' });
                          setShowForm(true);
                        }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteEvent(event.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                          {event.event_type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {event.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">{event.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PUZZLES TAB */}
          {activeTab === 'puzzles' && (
            <div className="space-y-6">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleLichessImport} disabled={isLoading} className="border-chess-accent text-chess-accent hover:bg-chess-accent/10">
                  <Download className="w-4 h-4 mr-2" /> Import Daily Puzzle
                </Button>
                <Button onClick={() => { resetForms(); setShowForm(true); }} className="bg-chess-accent hover:bg-chess-accent/90">
                  <Plus className="w-4 h-4 mr-2" /> Add Manually
                </Button>
              </div>

              {showForm && (
                <Card className="border-2 border-chess-accent/10">
                  <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Puzzle' : 'New Puzzle'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePuzzleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={puzzleForm.title} onChange={e => setPuzzleForm({ ...puzzleForm, title: e.target.value })} placeholder="e.g. Daily Tactic" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Complexity</Label>
                          <Select value={puzzleForm.difficulty} onValueChange={v => setPuzzleForm({ ...puzzleForm, difficulty: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <Input value={puzzleForm.theme} onChange={e => setPuzzleForm({ ...puzzleForm, theme: e.target.value })} placeholder="e.g. Pin, Fork" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>FEN Position</Label>
                        <Input value={puzzleForm.fen} onChange={e => setPuzzleForm({ ...puzzleForm, fen: e.target.value })} className="font-mono text-xs" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Solution (Moves separated by comma)</Label>
                        <Input value={puzzleForm.solution} onChange={e => setPuzzleForm({ ...puzzleForm, solution: e.target.value })} placeholder="e2e4, e7e5" required />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Puzzle'}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {puzzles.map((puzzle) => (
                  <Card key={puzzle.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${puzzle.difficulty === 'Hard' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>{puzzle.difficulty}</span>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => {
                            setIsEditing(true); setCurrentId(puzzle.id);
                            setPuzzleForm({
                              title: puzzle.title, fen: puzzle.fen,
                              solution: Array.isArray(puzzle.solution) ? puzzle.solution.join(', ') : puzzle.solution,
                              difficulty: puzzle.difficulty, theme: puzzle.theme || ''
                            });
                            setShowForm(true);
                          }}><Edit className="w-3 h-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => handleDeletePuzzle(puzzle.id)}>
                            <Trash className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-base mt-2">{puzzle.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono truncate mb-2">
                        {puzzle.fen}
                      </div>
                      <p className="text-xs text-gray-500">Theme: {puzzle.theme}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* BOT TAB */}
          {activeTab === 'bot' && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-6 h-6 text-chess-accent" />
                    Lichess Bot Control
                  </CardTitle>
                  <CardDescription>Manage your automated chess bot instance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Status</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${botStatus === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{botStatus}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {botStatus !== 'Running' ? (
                        <Button onClick={handleBotStart} className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]">
                          <Play className="w-4 h-4 mr-2" /> Start Bot
                        </Button>
                      ) : (
                        <Button onClick={handleBotStop} variant="destructive" className="min-w-[120px]">
                          <Square className="w-4 h-4 mr-2" /> Stop Bot
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Config Form */}
                    <form onSubmit={handleSaveBotConfig} className="space-y-4">
                      <h3 className="font-semibold text-lg">Configuration</h3>
                      <div className="space-y-2">
                        <Label>Lichess API Token</Label>
                        <Input
                          type="password"
                          value={botConfig.token}
                          onChange={e => setBotConfig({ ...botConfig, token: e.target.value })}
                          placeholder="lip_..."
                        />
                        <p className="text-xs text-gray-500">Get this from Lichess.org Settings.</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Engine Executable</Label>
                        <Input
                          value={botConfig.engine}
                          onChange={e => setBotConfig({ ...botConfig, engine: e.target.value })}
                          placeholder="stockfish.exe"
                        />
                        <p className="text-xs text-gray-500">Must be placed in lichess-bot/engines/ folder.</p>
                      </div>
                      <Button type="submit" variant="outline" className="w-full">
                        <Save className="w-4 h-4 mr-2" /> Save Configuration
                      </Button>
                    </form>

                    {/* Helper Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                      <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-2">Setup Instructions</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700 dark:text-blue-400">
                        <li>Download a UCI compatible engine (e.g., Stockfish).</li>
                        <li>Place the file in <code>lichess-bot-master/engines/</code>.</li>
                        <li>Enter the exact filename in the form.</li>
                        <li>Create a Bot Account on Lichess and generate an API Token with Bot permissions.</li>
                        <li>Save credentials and click Start!</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>Manage your account and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Admin Account</p>
                    <p className="text-sm text-gray-500">chessclub.sathyabama@gmail.com</p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-4">Security</h3>
                  <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        minLength={8}
                        placeholder="Min. 8 characters"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        minLength={8}
                        placeholder="Re-enter new password"
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="bg-chess-accent hover:bg-chess-accent/90">
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="font-medium">System Version</p>
                    <p className="text-sm text-gray-500">v1.2.0 (Bot Enabled)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
