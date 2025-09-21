import { useState, useEffect } from 'react';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  criticalOnly: boolean;
}

interface DashboardSettings {
  refreshInterval: number;
  defaultView: string;
  compactMode: boolean;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  dashboard: DashboardSettings;
}

interface AlertThresholds {
  min: number;
  max: number;
}

interface SystemSettings {
  dataRetention: number;
  alertThresholds: {
    temperature: AlertThresholds;
    pressure: AlertThresholds;
    flow: AlertThresholds;
  };
  integrations: {
    enabled: string[];
    apiKeys: Record<string, string>;
  };
  backup: {
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    location: 'local' | 'cloud' | 'both';
  };
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    sms: false,
    criticalOnly: false,
  },
  dashboard: {
    refreshInterval: 5000,
    defaultView: 'overview',
    compactMode: false,
  },
};

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  dataRetention: 90,
  alertThresholds: {
    temperature: { min: 0, max: 100 },
    pressure: { min: 0, max: 10 },
    flow: { min: 0, max: 1000 },
  },
  integrations: {
    enabled: [],
    apiKeys: {},
  },
  backup: {
    frequency: 'daily',
    retention: 30,
    location: 'cloud',
  },
};

export function useSettings() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPreferences');
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    }
    return DEFAULT_PREFERENCES;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('systemSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_SETTINGS;
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save to localStorage whenever preferences change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
    }
  }, [preferences]);

  // Save to localStorage whenever system settings change
  useEffect(() => {
    try {
      localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    } catch (err) {
      console.error('Error saving system settings:', err);
      setError('Failed to save system settings');
    }
  }, [systemSettings]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    try {
      const newPrefs = { ...preferences, ...updates };
      setPreferences(newPrefs);
      return Promise.resolve();
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
      return Promise.reject(err);
    }
  };

  const updateSystemSettings = (updates: Partial<SystemSettings>) => {
    try {
      const newSettings = { ...systemSettings, ...updates };
      setSystemSettings(newSettings);
      return Promise.resolve();
    } catch (err) {
      console.error('Error updating system settings:', err);
      setError('Failed to update system settings');
      return Promise.reject(err);
    }
  };

  return {
    preferences,
    systemSettings,
    loading,
    error,
    updatePreferences,
    updateSystemSettings,
  };
}
