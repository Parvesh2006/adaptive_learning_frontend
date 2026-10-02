import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, GraduationCap, Bell, Palette, Shield, LogOut, Check } from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayInput } from '@/components/clay/ClayInput';
import { ClayTabs } from '@/components/clay/ClayTabs';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({ daily: true, email: false, weekly: true });
  const [theme, setTheme] = useState('light');
  const [privacy, setPrivacy] = useState({ analytics: true, shareProgress: false });

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'preferences', label: 'Learning', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-charcoal-900">Settings</h1>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        {/* Section tabs */}
        <div className="flex flex-row gap-2 overflow-x-auto lg:flex-col">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-clay px-4 py-2.5 text-sm font-medium transition-all',
                  activeSection === section.id
                    ? 'bg-clay-50 text-violet-700 shadow-clay-raised'
                    : 'text-clay-600 hover:bg-ivory-100'
                )}
              >
                <Icon size={18} />
                {section.label}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2 rounded-clay bg-peach-100 px-4 py-2.5 text-sm font-medium text-peach-500 hover:bg-peach-200"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Content */}
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeSection === 'account' && (
            <ClayCard className="space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900">Account Settings</h2>
              <ClayInput label="Full Name" defaultValue={user?.name || 'Alex Chen'} />
              <ClayInput label="Email" type="email" defaultValue={user?.email || 'alex@example.com'} />
              <ClayInput label="Bio" defaultValue="CS student passionate about machine learning and AI." />
              <ClayButton>Save Changes</ClayButton>
            </ClayCard>
          )}

          {activeSection === 'preferences' && (
            <ClayCard className="space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900">Learning Preferences</h2>
              <div>
                <p className="mb-2 text-sm font-medium text-charcoal-700">Explanation Style</p>
                <ClayTabs
                  tabs={[
                    { id: 'simplified', label: 'Simplified' },
                    { id: 'detailed', label: 'Detailed' },
                    { id: 'technical', label: 'Technical' },
                  ]}
                  activeTab="simplified"
                  onChange={() => {}}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-charcoal-700">Pace</p>
                <ClayTabs
                  tabs={[
                    { id: 'slow', label: 'Slow' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'fast', label: 'Fast' },
                  ]}
                  activeTab="medium"
                  onChange={() => {}}
                />
              </div>
              <ClayButton>Save Preferences</ClayButton>
            </ClayCard>
          )}

          {activeSection === 'notifications' && (
            <ClayCard className="space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900">Notifications</h2>
              {[
                { key: 'daily', label: 'Daily study reminder', desc: 'Get reminded to study each day' },
                { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
                { key: 'weekly', label: 'Weekly progress report', desc: 'Summary of your weekly progress' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-clay bg-ivory-100 p-4 shadow-clay-pressed">
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">{item.label}</p>
                    <p className="text-xs text-clay-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={cn(
                      'relative h-7 w-12 rounded-full transition-all',
                      notifications[item.key as keyof typeof notifications] ? 'bg-violet-600' : 'bg-clay-300'
                    )}
                  >
                    <motion.div
                      animate={{ x: notifications[item.key as keyof typeof notifications] ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              ))}
            </ClayCard>
          )}

          {activeSection === 'appearance' && (
            <ClayCard className="space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900">Appearance</h2>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'auto'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-clay p-6 transition-all',
                      theme === t ? 'bg-violet-50 ring-2 ring-violet-400' : 'bg-ivory-100 hover:bg-ivory-200'
                    )}
                  >
                    <div className={cn('h-12 w-12 rounded-clay', t === 'light' ? 'bg-ivory-100' : t === 'dark' ? 'bg-charcoal-900' : 'bg-gradient-to-br from-ivory-100 to-charcoal-900')} />
                    <span className={cn('text-sm font-medium capitalize', theme === t ? 'text-violet-700' : 'text-charcoal-700')}>{t}</span>
                  </button>
                ))}
              </div>
            </ClayCard>
          )}

          {activeSection === 'privacy' && (
            <ClayCard className="space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900">Privacy</h2>
              {[
                { key: 'analytics', label: 'Anonymous analytics', desc: 'Help improve the product with anonymous data' },
                { key: 'shareProgress', label: 'Share progress', desc: 'Allow your progress to be visible to others' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-clay bg-ivory-100 p-4 shadow-clay-pressed">
                  <div>
                    <p className="text-sm font-medium text-charcoal-900">{item.label}</p>
                    <p className="text-xs text-clay-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, [item.key]: !privacy[item.key as keyof typeof privacy] })}
                    className={cn(
                      'relative h-7 w-12 rounded-full transition-all',
                      privacy[item.key as keyof typeof privacy] ? 'bg-violet-600' : 'bg-clay-300'
                    )}
                  >
                    <motion.div
                      animate={{ x: privacy[item.key as keyof typeof privacy] ? 22 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              ))}
            </ClayCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
