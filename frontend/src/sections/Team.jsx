import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, VimeoIcon } from '../components/SocialIcons';
import teamData from '../data/team.json';

export default function Team() {
  return (
    <section id="team" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-gold" />
            Master Visionaries
            <Camera className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Meet Our Studio Crew
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            A collective of acclaimed fashion photographers, cinema directors, and drone specialists united by a passion for luxury storytelling.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamData.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl overflow-hidden border border-rust/15 shadow-luxury hover:shadow-gold-glow transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-3 text-cream">
                      <a href={member.social.instagram} className="p-2 rounded-full bg-rust/80 hover:bg-rust text-gold transition-colors">
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                      <a href={member.social.vimeo} className="p-2 rounded-full bg-rust/80 hover:bg-rust text-gold transition-colors">
                        <VimeoIcon className="w-4 h-4" />
                      </a>
                      <a href={member.social.linkedin} className="p-2 rounded-full bg-rust/80 hover:bg-rust text-gold transition-colors">
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[10px] uppercase font-montserrat tracking-widest text-gold-dark font-semibold block mb-1">
                    {member.experience}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-rust">
                    {member.name}
                  </h3>
                  <p className="text-xs font-serif italic text-clay">
                    {member.role}
                  </p>
                  <p className="text-xs text-charcoal/70 font-sans mt-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
