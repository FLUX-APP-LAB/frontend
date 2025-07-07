import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, Settings, Eye, EyeOff, Hash, Video, Monitor } from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { WebRTCStream } from '../stream/WebRTCStream';
import { useAppStore } from '../../store/appStore';
import toast from 'react-hot-toast';

interface LiveStreamSetupProps {
  onClose: () => void;
}

export const LiveStreamSetup: React.FC<LiveStreamSetupProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [streamKey] = useState('flux_' + Math.random().toString(36).substr(2, 9));
  
  const { currentUser, activeStreams, setActiveStreams, setCurrentStream, setActivePage } = useAppStore();

  const categories = [
    'Gaming', 'Music', 'Art', 'Technology', 'Education', 
    'Cooking', 'Fitness', 'Travel', 'Comedy', 'Other'
  ];

  const startLiveStream = async () => {
    if (!title.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsStarting(true);

    // Simulate stream setup
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newStream = {
      id: Date.now().toString(),
      title: title.trim(),
      thumbnail: 'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      creator: currentUser!,
      viewers: 0,
      isLive: true,
      category,
      description,
      isPrivate,
      streamKey,
      startedAt: new Date(),
    };

    // Add to active streams
    setActiveStreams([newStream, ...activeStreams]);
    setCurrentStream(newStream);
    
    // Update user status
    if (currentUser) {
      currentUser.isLiveStreaming = true;
    }

    setIsStarting(false);
    toast.success('Stream started successfully!');
    setActivePage('stream');
    onClose();
  };

  const handleStreamStart = (stream: MediaStream) => {
    console.log('Stream started with tracks:', stream.getTracks());
    toast.success('Camera/microphone connected successfully!');
  };

  const handleStreamEnd = () => {
    console.log('Stream ended');
    toast('Stream preview stopped');
  };

  return (
    <div className="space-y-6">
      {/* Stream Preview */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-flux-text-primary">Stream Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <div className="aspect-video bg-flux-bg-tertiary rounded-xl overflow-hidden">
            <WebRTCStream
              streamId="preview"
              isStreamer={true}
              onStreamStart={handleStreamStart}
              onStreamEnd={handleStreamEnd}
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="aspect-video bg-flux-bg-tertiary rounded-xl overflow-hidden flex items-center justify-center">
            <div className="text-center">
              <Video className="w-12 h-12 text-flux-text-secondary mx-auto mb-4" />
              <p className="text-flux-text-secondary">Preview disabled</p>
              <p className="text-flux-text-secondary text-sm">Click the eye icon to enable preview</p>
            </div>
          </div>
        )}

        {/* Live Indicator */}
        <div className="absolute top-4 left-4">
          <div className="bg-flux-accent-red px-3 py-1 rounded-full text-white text-sm font-bold flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>PREVIEW</span>
          </div>
        </div>

        {/* Stream Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={currentUser?.avatar}
              alt={currentUser?.displayName || ''}
              size="md"
              isLive={true}
            />
            <div>
              <h3 className="text-white font-semibold">
                {title || 'Untitled Stream'}
              </h3>
              <p className="text-white/80 text-sm">
                {currentUser?.displayName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-flux-text-primary mb-2">
            Stream Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you streaming today?"
            className="w-full px-4 py-3 bg-flux-bg-tertiary text-flux-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-flux-primary"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-flux-text-primary mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-flux-bg-tertiary text-flux-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-flux-primary"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-flux-text-primary mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers what to expect..."
            rows={3}
            className="w-full px-4 py-3 bg-flux-bg-tertiary text-flux-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-flux-primary resize-none"
            maxLength={500}
          />
        </div>

        {/* Privacy Settings */}
        <div className="flex items-center justify-between p-4 bg-flux-bg-tertiary rounded-lg">
          <div className="flex items-center space-x-3">
            {isPrivate ? (
              <EyeOff className="w-5 h-5 text-flux-text-secondary" />
            ) : (
              <Eye className="w-5 h-5 text-flux-text-secondary" />
            )}
            <div>
              <p className="text-flux-text-primary font-medium">
                {isPrivate ? 'Private Stream' : 'Public Stream'}
              </p>
              <p className="text-flux-text-secondary text-sm">
                {isPrivate 
                  ? 'Only followers can join your stream'
                  : 'Anyone can discover and join your stream'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isPrivate ? 'bg-flux-primary' : 'bg-flux-bg-secondary'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isPrivate ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Stream Key */}
        <div className="p-4 bg-flux-bg-tertiary rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-flux-text-primary">
              Stream Key
            </label>
            <Button size="sm" variant="ghost">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <div className="font-mono text-sm text-flux-text-secondary bg-flux-bg-secondary px-3 py-2 rounded border">
            {streamKey}
          </div>
          <p className="text-xs text-flux-text-secondary mt-2">
            Use this key in your streaming software (OBS, XSplit, etc.)
          </p>
        </div>

        {/* Quick Tips */}
        <div className="p-4 bg-flux-primary/10 border border-flux-primary/20 rounded-lg">
          <h4 className="text-sm font-semibold text-flux-primary mb-2">Quick Tips</h4>
          <ul className="text-xs text-flux-text-secondary space-y-1">
            <li>• Make sure you have good lighting and audio quality</li>
            <li>• Test your camera and microphone before going live</li>
            <li>• Choose a descriptive title to attract viewers</li>
            <li>• Interact with your audience in the chat</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isStarting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={startLiveStream}
          disabled={isStarting || !title.trim() || !category}
          isLoading={isStarting}
          className="flex-1"
        >
          {isStarting ? 'Starting Stream...' : 'Go Live'}
        </Button>
      </div>
    </div>
  );
};