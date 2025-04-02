import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  id: number;
  date: string;
  description: string;
  imageUrl?: string;
}

export const Timeline: FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: '',
    description: '',
    imageUrl: ''
  });

  // Fetch timeline events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/timeline');
        if (!response.ok) throw new Error('Failed to fetch timeline');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Failed to load timeline events');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Add new event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date(newEvent.date).toISOString(),
          description: newEvent.description,
          imageUrl: newEvent.imageUrl || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to add event');
      
      const addedEvent = await response.json();
      setEvents(prev => [...prev, addedEvent]);
      setIsAddingEvent(false);
      setNewEvent({ date: '', description: '', imageUrl: '' });
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading timeline...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />
        
        {/* Timeline events */}
        <div className="space-y-24">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className={cn(
                "relative flex items-center",
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              )}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-pink-400" />
              
              {/* Content */}
              <motion.div
                className={cn(
                  "w-5/12 p-4 bg-white rounded-lg shadow-lg",
                  index % 2 === 0 ? "mr-auto" : "ml-auto"
                )}
                whileHover={{ scale: 1.05 }}
              >
                <div className="polaroid bg-white p-2 shadow-md transform rotate-2">
                  {event.imageUrl ? (
                    <div className="relative w-full aspect-square mb-2">
                      <Image
                        src={event.imageUrl}
                        alt={event.description}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square mb-2 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-handwriting text-lg mb-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsAddingEvent(true)}
          className="bg-pink-500 text-white rounded-full p-4 shadow-lg hover:bg-pink-600 transition-colors"
        >
          Add Memory
        </button>
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Memory</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
                <input
                  type="url"
                  value={newEvent.imageUrl}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Add Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 