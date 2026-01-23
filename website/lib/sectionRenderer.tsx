import React from 'react';
import { Section } from '@/types';

export function renderSection(section: Section): React.ReactNode {
  const { type, content } = section;

  switch (type) {
    case 'HERO':
      return (
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-5xl font-bold mb-4">{content.heading || ''}</h2>
            <p className="text-xl mb-8">{content.subheading || ''}</p>
            {content.image && (
              <img
                src={content.image}
                alt={content.heading || 'Hero image'}
                className="max-w-full h-auto mx-auto mb-8 rounded-lg"
              />
            )}
            {content.buttonText && (
              <a
                href={content.buttonLink || '#'}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {content.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    case 'TEXT':
      return (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {content.title && (
              <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
            )}
            {content.content && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            )}
          </div>
        </section>
      );

    case 'IMAGE':
      return (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {content.image && (
              <figure className="text-center">
                <img
                  src={content.image}
                  alt={content.alt || ''}
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
                {content.caption && (
                  <figcaption className="mt-4 text-gray-600 italic">
                    {content.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </section>
      );

    case 'CTA':
      return (
        <section className="bg-gray-100 py-16 px-4">
          <div className="container mx-auto text-center">
            {content.title && (
              <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
            )}
            {content.description && (
              <p className="text-lg text-gray-700 mb-8">{content.description}</p>
            )}
            {content.buttonText && (
              <a
                href={content.buttonLink || '#'}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {content.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    case 'FAQ':
      return (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {content.items?.map((item: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    default:
      return (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <p className="text-gray-500">Unknown section type: {type}</p>
          </div>
        </section>
      );
  }
}
