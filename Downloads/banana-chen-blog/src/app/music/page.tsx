"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Music, Upload, Pause, Play, Volume2 } from "lucide-react";

export default function MusicPage() {
  const { toast } = useToast();
  const [music, setMusic] = useState<{
    src: string;
    title: string;
    coverSrc: string;
    description: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [description, setDescription] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const fileName = file.name;

    const fileUrl = URL.createObjectURL(file);

    setMusic({
      src: fileUrl,
      title: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
      coverSrc: "", // Default empty cover
      description: "",
    });

    toast({
      title: "music added",
      description: `your music "${fileName}" has been added.`,
    });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !music) return;

    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);

    setMusic({
      ...music,
      coverSrc: fileUrl,
    });

    toast({
      title: "cover added",
      description: "album cover has been updated.",
    });
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  const handleDescriptionSave = () => {
    if (music) {
      setMusic({
        ...music,
        description,
      });
      toast({
        title: "description saved",
        description: "your description has been updated.",
      });
    }
  };

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-light tracking-wide text-center mb-6">music</h2>

        <div className="flex flex-col items-center">
          {!music ? (
            <Card className="w-full max-w-3xl shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
                  <Music className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-light mb-2">no music yet</h3>
                  <p className="text-muted-foreground mb-6 font-light">
                    add your favorite song to share with her.
                  </p>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleMusicUpload}
                      className="hidden"
                      id="music-upload"
                    />
                    <label htmlFor="music-upload" className="cursor-pointer">
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Upload className="mr-2 h-4 w-4" /> upload music
                      </Button>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full max-w-3xl shadow-md overflow-hidden">
              <CardContent className="p-6">
                <div className="music-player p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-auto flex-shrink-0">
                      {music.coverSrc ? (
                        <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-md group">
                          <img
                            src={music.coverSrc}
                            alt={`Cover for ${music.title}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCoverUpload}
                              className="hidden"
                              id="cover-upload"
                            />
                            <label htmlFor="cover-upload" className="cursor-pointer">
                              <Button size="sm" variant="secondary">
                                <Upload className="h-3 w-3 mr-1" /> change cover
                              </Button>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-48 h-48 rounded-lg overflow-hidden bg-blue-100/30 flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                            id="cover-upload"
                          />
                          <label htmlFor="cover-upload" className="cursor-pointer">
                            <Button variant="secondary">
                              <Upload className="mr-2 h-4 w-4" /> add cover
                            </Button>
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <h3 className="text-2xl font-light tracking-wide mb-2">{music.title}</h3>

                      <div className="flex items-center gap-3 mb-6 mt-4">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={handlePlay}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>

                        <div className="flex items-center gap-2 flex-1">
                          <Volume2 className="h-4 w-4 text-muted-foreground" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 bg-secondary rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                          />
                        </div>
                      </div>

                      <audio
                        ref={audioRef}
                        src={music.src}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />

                      <div>
                        <h4 className="text-sm font-light mb-2">description</h4>
                        {music.description ? (
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                            <p className="whitespace-pre-wrap font-light">{music.description}</p>
                            <Button
                              variant="link"
                              className="px-0 py-1 h-auto text-xs"
                              onClick={() => setDescription(music.description)}
                            >
                              edit
                            </Button>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm mb-4 font-light">
                            add a description to tell her why this song is special.
                          </p>
                        )}

                        <div className="flex gap-2">
                          <Input
                            placeholder="write a message about this song..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex-1 font-light"
                          />
                          <Button onClick={handleDescriptionSave} className="bg-blue-500 hover:bg-blue-600">
                            save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.main>
    </div>
  );
}
