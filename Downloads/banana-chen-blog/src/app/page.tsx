"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload, Plus, X, Image as ImageIcon, PenLine, Heart } from "lucide-react";
import Link from "next/link";
import SpecialDates from "@/components/special-dates";
import { Timeline } from '@/components/Timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music } from '@/components/Music';
import { Letters } from '@/components/Letters';

// Pre-generate positions for decorative elements to avoid hydration mismatch
const HEARTS_POSITIONS = [
  { left: "10%", top: "15%", size: "1.2rem", delay: 0 },
  { left: "20%", top: "45%", size: "1.5rem", delay: 1 },
  { left: "35%", top: "75%", size: "1.8rem", delay: 2 },
  { left: "50%", top: "25%", size: "1.3rem", delay: 3 },
  { left: "65%", top: "65%", size: "1.1rem", delay: 1.5 },
  { left: "80%", top: "35%", size: "1.7rem", delay: 2.5 },
  { left: "90%", top: "85%", size: "1.4rem", delay: 0.5 },
  { left: "15%", top: "55%", size: "1.9rem", delay: 3.5 },
  { left: "70%", top: "10%", size: "1.6rem", delay: 1.2 },
  { left: "40%", top: "90%", size: "1.3rem", delay: 2.8 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400">
        Our Story
      </h1>
      
      <Tabs defaultValue="timeline" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="letters">Letters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-4">
          <Timeline />
        </TabsContent>
        
        <TabsContent value="music" className="mt-4">
          <Music />
        </TabsContent>
        
        <TabsContent value="letters" className="mt-4">
          <Letters />
        </TabsContent>
      </Tabs>
    </main>
  );
}
