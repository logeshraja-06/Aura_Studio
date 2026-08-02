import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';

const INSTA_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
    likes: '1.2k',
    comments: 84,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    likes: '2.4k',
    comments: 142,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
    likes: '980',
    comments: 62,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    likes: '1.8k',
    comments: 110,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
    likes: '3.1k',
    comments: 215,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=600&q=80',
    likes: '1.5k',
    comments: 96,
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center gap-2 mb-2">
              <InstagramIcon className="w-4 h-4 text-gold" />
              @AURAWeddingStudio
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-rust">
              Follow Our Daily Stories
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-rust text-cream text-xs font-montserrat font-semibold uppercase tracking-wider shadow-rust-glow hover:bg-rust-dark transition-colors flex items-center gap-2 border border-gold/30"
          >
            <InstagramIcon className="w-4 h-4 text-gold" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 6 Post Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTA_POSTS.map((post) => (
            <motion.a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-charcoal shadow-md border border-rust/15"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-charcoal/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-cream text-xs font-montserrat font-bold">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-gold text-gold" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4 text-cream" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
