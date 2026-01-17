'use client';

import { useRouter } from 'next/navigation';
import { FiFileText, FiImage, FiList, FiLink, FiVideo, FiMusic, FiCheckSquare, FiClipboard, FiBarChart2, FiCoffee } from 'react-icons/fi';

const postFormats = [
  {
    id: 'article',
    title: 'Article',
    description: 'An article with images and embed videos',
    icon: FiFileText,
    color: 'text-teal-600',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    description: 'A collection of images',
    icon: FiImage,
    color: 'text-teal-600',
  },
  {
    id: 'sorted-list',
    title: 'Sorted List',
    description: 'A list based article',
    icon: FiList,
    color: 'text-teal-600',
  },
  {
    id: 'table-of-contents',
    title: 'Table of Contents',
    description: 'List of links based on the headings',
    icon: FiLink,
    color: 'text-teal-600',
  },
  {
    id: 'video',
    title: 'Video',
    description: 'Upload or embed videos',
    icon: FiVideo,
    color: 'text-teal-600',
  },
  {
    id: 'audio',
    title: 'Audio',
    description: 'Upload audios and create playlist',
    icon: FiMusic,
    color: 'text-teal-600',
  },
  {
    id: 'trivia-quiz',
    title: 'Trivia Quiz',
    description: 'Quizzes with right and wrong answers',
    icon: FiCheckSquare,
    color: 'text-teal-600',
  },
  {
    id: 'personality-quiz',
    title: 'Personality Quiz',
    description: 'Quizzes with custom results',
    icon: FiClipboard,
    color: 'text-teal-600',
  },
  {
    id: 'poll',
    title: 'Poll',
    description: 'Create polls and surveys',
    icon: FiBarChart2,
    color: 'text-teal-600',
  },
  {
    id: 'recipe',
    title: 'Recipe',
    description: 'Share recipes with ingredients and instructions',
    icon: FiCoffee,
    color: 'text-teal-600',
  },
];

export default function NewPostPage() {
  const router = useRouter();

  const handleFormatSelect = (formatId) => {
    // Route to the edit page with format parameter
    // The [id]/edit route handles both 'new' and existing IDs
    router.push(`/cms/posts/new/edit?format=${formatId}`);
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Choose a Post Format</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {postFormats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format.id)}
                className="group relative bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-teal-500 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex flex-col items-start space-y-4">
                  <div className={`${format.color} text-4xl group-hover:scale-110 transition-transform duration-200`}>
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {format.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {format.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
