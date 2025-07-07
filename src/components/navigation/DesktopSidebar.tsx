import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Radio, 
  Users, 
  Settings, 
  Bell,
  Bookmark,
  TrendingUp,
  Gamepad2,
  Trophy,
  Wallet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/appStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { CreateContentModal } from '../create/CreateContentModal';

export const DesktopSidebar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    currentUser, 
    setAuthenticated, 
    setCurrentUser,
    desktopSidebarCollapsed,
    setDesktopSidebarCollapsed
  } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mainNavItems = [
    { id: 'home', icon: Home, label: 'Home', badge: null },
    { id: 'discover', icon: Search, label: 'Discover', badge: null },
    { id: 'following', icon: Users, label: 'Following', badge: '12' },
    { id: 'stream', icon: Radio, label: 'Live Streams', badge: null },
  ] as const;

  const secondaryNavItems = [
    { id: 'trending', icon: TrendingUp, label: 'Trending', badge: null },
    { id: 'gaming', icon: Gamepad2, label: 'Gaming Hub', badge: 'New' },
    { id: 'rewards', icon: Trophy, label: 'Rewards', badge: null },
    { id: 'saved', icon: Bookmark, label: 'Saved', badge: null },
  ] as const;

  const bottomNavItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: '3' },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
  ] as const;

  const handleNavClick = (itemId: string) => {
    if (itemId === 'create') {
      setShowCreateModal(true);
    } else {
      setActivePage(itemId as any);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setCurrentUser(null);
    setActivePage('home');
  };

  return (
    <>
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: desktopSidebarCollapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col h-screen bg-flux-bg-secondary border-r border-flux-bg-tertiary fixed left-0 top-0 z-40"
      >
        {/* Header */}
        <div className="p-6 border-b border-flux-bg-tertiary">
          <div className="flex items-center justify-between">
            {!desktopSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: desktopSidebarCollapsed ? 0 : 1 }}
                className="text-2xl font-bold bg-flux-gradient bg-clip-text text-transparent"
              >
                FLUX
              </motion.div>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
              className="ml-auto"
            >
              {desktopSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-flux-bg-tertiary">
          <div className="flex items-center space-x-3">
            <Avatar
              src={currentUser?.avatar}
              alt={currentUser?.displayName || ''}
              size="lg"
              isLive={currentUser?.isLiveStreaming}
              tier={currentUser?.tier}
            />
            {!desktopSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: desktopSidebarCollapsed ? 0 : 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-flux-text-primary font-semibold truncate">
                  {currentUser?.displayName}
                </p>
                <p className="text-flux-text-secondary text-sm truncate">
                  @{currentUser?.username}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-flux-text-secondary">
                  <span>{currentUser?.followerCount?.toLocaleString()} followers</span>
                  <span>{currentUser?.followingCount?.toLocaleString()} following</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Create Button */}
        <div className="p-4 border-b border-flux-bg-tertiary">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-flux-gradient hover:opacity-90 text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            {!desktopSidebarCollapsed && 'Create Content'}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="p-4">
            {!desktopSidebarCollapsed && (
              <h3 className="text-flux-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
                Main
              </h3>
            )}
            <nav className="space-y-1">
              {mainNavItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left",
                    activePage === (item.id as string)
                      ? "bg-flux-primary text-white"
                      : "text-flux-text-secondary hover:text-flux-text-primary hover:bg-flux-bg-tertiary"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!desktopSidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: desktopSidebarCollapsed ? 0 : 1 }}
                      className="flex items-center justify-between flex-1"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-flux-accent-red text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div className="p-4 border-t border-flux-bg-tertiary">
            {!desktopSidebarCollapsed && (
              <h3 className="text-flux-text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
                Explore
              </h3>
            )}
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left",
                    activePage === item.id
                      ? "bg-flux-primary text-white"
                      : "text-flux-text-secondary hover:text-flux-text-primary hover:bg-flux-bg-tertiary"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!desktopSidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: desktopSidebarCollapsed ? 0 : 1 }}
                      className="flex items-center justify-between flex-1"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          item.badge === 'New' 
                            ? "bg-flux-accent-green text-white"
                            : "bg-flux-accent-red text-white"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-flux-bg-tertiary">
          <nav className="space-y-1 mb-4">
            {bottomNavItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left",
                  activePage === item.id
                    ? "bg-flux-primary text-white"
                    : "text-flux-text-secondary hover:text-flux-text-primary hover:bg-flux-bg-tertiary"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!desktopSidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: desktopSidebarCollapsed ? 0 : 1 }}
                    className="flex items-center justify-between flex-1"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="bg-flux-accent-red text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Wallet & Logout */}
          <div className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => handleNavClick('wallet')}
            >
              <Wallet className="w-4 h-4 mr-2" />
              {!desktopSidebarCollapsed && 'Wallet'}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-flux-accent-red hover:text-flux-accent-red hover:bg-flux-accent-red/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {!desktopSidebarCollapsed && 'Sign Out'}
            </Button>
          </div>
        </div>
      </motion.div>

      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};