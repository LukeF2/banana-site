import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  description: string | null;
}

export const Music: FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingSong, setIsAddingSong] = useState(false);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    url: '',
    description: ''
  });

  // Fetch songs
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs');
        if (!response.ok) throw new Error('Failed to fetch songs');
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        setError('Failed to load songs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Add new song
  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
      });

      if (!response.ok) throw new Error('Failed to add song');
      
      const addedSong = await response.json();
      setSongs(prev => [...prev, addedSong]);
      setIsAddingSong(false);
      setNewSong({ title: '', artist: '', url: '', description: '' });
    } catch (err) {
      console.error('Error adding song:', err);
      setError('Failed to add song');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading songs...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setCurrentSong(song)}
          >
            <h3 className="text-xl font-semibold mb-2">{song.title}</h3>
            <p className="text-gray-600 mb-2">{song.artist}</p>
            <p className="text-sm text-gray-500">{song.description}</p>
          </div>
        ))}
      </div>

      {currentSong && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Now Playing: {currentSong.title}</h2>
          <div className="aspect-video">
            <ReactPlayer
              url={currentSong.url}
              width="100%"
              height="100%"
              controls
              playing
            />
          </div>
        </div>
      )}

      {/* Add Song Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsAddingSong(true)}
          className="bg-pink-500 text-white rounded-full p-4 shadow-lg hover:bg-pink-600 transition-colors"
        >
          Add Song
        </button>
      </div>

      {/* Add Song Modal */}
      {isAddingSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Song</h2>
            <form onSubmit={handleAddSong} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newSong.title}
                  onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Artist</label>
                <input
                  type="text"
                  value={newSong.artist}
                  onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={newSong.url}
                  onChange={(e) => setNewSong(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={newSong.description}
                  onChange={(e) => setNewSong(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSong(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  Add Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 