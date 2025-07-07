import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users, Play } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store/appStore';
import { generateMockData, formatNumber } from '../../lib/utils';

export const DiscoverScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trending' | 'hashtags' | 'creators'>('trending');
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<any[]>([]);
  const [suggestedCreators, setSuggestedCreators] = useState<any[]>([]);
  const { setActivePage } = useAppStore();

  useEffect(() => {
    const { mockVideos, mockUsers } = generateMockData();
    setTrendingVideos(mockVideos.slice(0, 6));
    setSuggestedCreators(mockUsers);
    setTrendingHashtags([
      { tag: '#viral', posts: 2400000, growth: '+12%' },
      { tag: '#fyp', posts: 1800000, growth: '+8%' },
      { tag: '#trending', posts: 1200000, growth: '+15%' },
      { tag: '#comedy', posts: 980000, growth: '+5%' },
      { tag: '#music', posts: 750000, growth: '+20%' },
      { tag: '#dance', posts: 650000, growth: '+10%' },
    ]);
  }, []);

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'creators', label: 'Creators', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-flux-bg-primary pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-flux-bg-primary/95 backdrop-blur-lg border-b border-flux-bg-tertiary z-10">
        <div className="p-4 pt-12">
          <h1 className="text-2xl font-bold text-flux-text-primary mb-4">Discover</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos, creators, hashtags..."
              className="w-full pl-10 pr-4 py-3 bg-flux-bg-secondary text-flux-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-flux-primary"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-flux-bg-secondary rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-flux-primary text-white'
                    : 'text-flux-text-secondary hover:text-flux-text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-flux-text-primary mb-4">
                Trending Videos
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {trendingVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-flux-bg-secondary cursor-pointer"
                    onClick={() => setActivePage('home')}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 left-2">
                      <div className="bg-flux-accent-red px-2 py-1 rounded text-white text-xs font-bold">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                        {video.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3 text-white" />
                        <span className="text-white/80 text-xs">
                          {formatNumber(video.views)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-flux-text-primary">
              Trending Hashtags
            </h2>
            {trendingHashtags.map((hashtag, index) => (
              <motion.div
                key={hashtag.tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-flux-bg-secondary rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-flux-gradient rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-flux-text-primary font-semibold">
                      {hashtag.tag}
                    </p>
                    <p className="text-flux-text-secondary text-sm">
                      {formatNumber(hashtag.posts)} posts
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-flux-accent-green text-sm font-medium">
                    {hashtag.growth}
                  </p>
                  <p className="text-flux-text-secondary text-xs">growth</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'creators' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-flux-text-primary">
              Suggested Creators
            </h2>
            {suggestedCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-flux-bg-secondary rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={creator.avatar}
                    alt={creator.displayName}
                    size="lg"
                  />
                  <div>
                    <p className="text-flux-text-primary font-semibold">
                      {creator.displayName}
                    </p>
                    <p className="text-flux-text-secondary text-sm">
                      @{creator.username}
                    </p>
                    <p className="text-flux-text-secondary text-xs">
                      {formatNumber(Math.floor(Math.random() * 1000000))} followers
                    </p>
                  </div>
                </div>
                <Button size="sm">Follow</Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};