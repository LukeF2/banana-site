import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Letter {
  id: number;
  title: string;
  content: string;
  date: string;
}

export const Letters: FC = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingLetter, setIsAddingLetter] = useState(false);
  const [newLetter, setNewLetter] = useState({
    title: '',
    content: '',
    date: ''
  });

  // Fetch letters
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await fetch('/api/letters');
        if (!response.ok) throw new Error('Failed to fetch letters');
        const data = await response.json();
        setLetters(data);
      } catch (err) {
        setError('Failed to load letters');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetters();
  }, []);

  // Add new letter
  const handleAddLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLetter,
          date: new Date(newLetter.date).toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to add letter');
      
      const addedLetter = await response.json();
      setLetters(prev => [...prev, addedLetter]);
      setIsAddingLetter(false);
      setNewLetter({ title: '', content: '', date: '' });
    } catch (err) {
      console.error('Error adding letter:', err);
      setError('Failed to add letter');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading letters...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {letters.map((letter, index) => (
        <motion.div
          key={letter.id}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{letter.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(letter.date).toLocaleDateString()}
            </p>
          </div>
          <p className="text-gray-700 font-light leading-relaxed whitespace-pre-line">
            {letter.content}
          </p>
        </motion.div>
      ))}

      {/* Add Letter Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsAddingLetter(true)}
          className="bg-pink-500 text-white rounded-full p-4 shadow-lg hover:bg-pink-600 transition-colors"
        >
          Write Letter
        </button>
      </div>

      {/* Add Letter Modal */}
      {isAddingLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Write New Letter</h2>
            <form onSubmit={handleAddLetter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newLetter.title}
                  onChange={(e) => setNewLetter(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={newLetter.date}
                  onChange={(e) => setNewLetter(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={newLetter.content}
                  onChange={(e) => setNewLetter(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={6}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLetter(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Save Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 