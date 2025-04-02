"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Save, Edit, X } from "lucide-react";

interface LetterCategory {
  title: string;
  gradient: string;
  defaultText: string;
}

interface LetterCategories {
  [key: string]: LetterCategory;
}

const letterCategories: LetterCategories = {
  sad: {
    title: "for when you're sad",
    gradient: "from-blue-400 to-indigo-500",
    defaultText: "this is a place for words of comfort when you're feeling down. click edit to add your message."
  },
  frustrated: {
    title: "for when you're frustrated",
    gradient: "from-pink-400 to-red-400",
    defaultText: "this is a place for encouragement during tough times. click edit to add your message."
  },
  tired: {
    title: "for when you're tired",
    gradient: "from-green-300 to-teal-400",
    defaultText: "this is a place for soothing words when energy is low. click edit to add your message."
  },
  happy: {
    title: "for when you're happy",
    gradient: "from-blue-300 to-pink-200",
    defaultText: "this is a place to celebrate joyful moments. click edit to add your message."
  },
};

export default function LetterPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const letterCategory = letterCategories[id];

  // Initialize state at the top level of the component
  const [letterContent, setLetterContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [isValidCategory, setIsValidCategory] = useState(true);

  useEffect(() => {
    // Check if this is a valid letter category
    if (!letterCategory) {
      setIsValidCategory(false);
      router.push("/letters");
      return;
    }

    // Load saved letter content from localStorage
    const storageKey = `letter_${id}`;
    const savedContent = localStorage.getItem(storageKey);

    if (savedContent) {
      setLetterContent(savedContent);
    } else if (letterCategory) {
      setLetterContent(letterCategory.defaultText);
    }
  }, [id, letterCategory, router]);

  const handleEdit = () => {
    setEditContent(letterContent);
    setIsEditing(true);
  };

  const handleSave = () => {
    const storageKey = `letter_${id}`;
    setLetterContent(editContent);
    localStorage.setItem(storageKey, editContent);
    setIsEditing(false);

    toast({
      title: "letter saved",
      description: "your letter has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isValidCategory || !letterCategory) {
    return null;
  }

  return (
    <div className="page-transition">
      <Navigation />

      <motion.main
        className="mt-8 pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push("/letters")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            back to letters
          </Button>

          <Card className="overflow-hidden shadow-md">
            <div
              className={`h-24 bg-gradient-to-r ${letterCategory.gradient} flex items-center justify-center p-6`}
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-wide text-white">
                {letterCategory.title}
              </h2>
            </div>

            <CardContent className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="write your letter here..."
                    className="w-full min-h-[300px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-light"
                  />

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                      <Save className="mr-2 h-4 w-4" />
                      save letter
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap p-4 min-h-[300px] font-light text-foreground/90">
                      {letterContent}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600">
                      <Edit className="mr-2 h-4 w-4" />
                      edit letter
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.main>
    </div>
  );
}
