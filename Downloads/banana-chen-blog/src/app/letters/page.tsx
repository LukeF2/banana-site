"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/navigation";

interface LetterCategory {
  id: string;
  title: string;
  description: string;
  gradient: string;
}

const letterCategories: LetterCategory[] = [
  {
    id: "sad",
    title: "for when you're sad",
    description: "words to comfort you when you're feeling down",
    gradient: "from-blue-400 to-indigo-500"
  },
  {
    id: "frustrated",
    title: "for when you're frustrated",
    description: "a little encouragement for the tough times",
    gradient: "from-pink-400 to-red-400"
  },
  {
    id: "tired",
    title: "for when you're tired",
    description: "take a breath and read this",
    gradient: "from-green-300 to-teal-400"
  },
  {
    id: "happy",
    title: "for when you're happy",
    description: "let's celebrate together",
    gradient: "from-blue-300 to-pink-200"
  },
];

interface LetterCardProps {
  category: LetterCategory;
}

const LetterCard = ({ category }: LetterCardProps) => {
  return (
    <Link href={`/letters/${category.id}`} className="block w-full">
      <Card className="letter-button h-48 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}
        />
        <div className="relative h-full flex flex-col justify-end p-6 text-white">
          <h3 className="text-xl font-light tracking-wide mb-2">{category.title}</h3>
          <p className="text-sm opacity-90 font-light">{category.description}</p>
        </div>
      </Card>
    </Link>
  );
};

export default function LettersPage() {
  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-light tracking-wide text-center mb-8">letters</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {letterCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: letterCategories.indexOf(category) * 0.1
              }}
            >
              <LetterCard category={category} />
            </motion.div>
          ))}
        </div>
      </motion.main>
    </div>
  );
}
