
import React, { useEffect, useState } from 'react';
import { Save, Loader2, Globe, CreditCard, Link as LinkIcon, Bell } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Button';
import { Toggle } from '../../components/Form/Toggle';
import { useToast } from '../../contexts/ToastContext';

type SettingsTab = 'general' | 'integrations' | 'notifications';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await adminApi.getSettings();
        if (res.success) setSettings(res.data);
      } catch (e) {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.saveSettings(settings);
      showToast('Settings saved successfully', 'success');
    } catch (e) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-display font-semibold text-slate-900">Store Settings</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex gap-8">
          {[
            { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
            { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-8">
        
        {activeTab === 'general' && (
          <div className="bg-white p-8 border border-slate-100 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-50 pb-4 mb-6">Store Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Store Name" 
                value={settings.storeName}
                onChange={(e) => setSettings({...settings, storeName: e.target.value})}
              />
              <Input 
                label="Support Email" 
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
              />
              <Input 
                label="Currency" 
                value={settings.currency}
                disabled
                className="opacity-50 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-medium text-slate-900">Dropshipping Providers</h3>
                 <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase">Beta</span>
              </div>
              
              <div className="space-y-6">
                {/* AliExpress */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-sm bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xs">ALI</div>
                    <div>
                      <h4 className="font-medium text-slate-900">AliExpress</h4>
                      <p className="text-xs text-slate-500">Connect via Official API or Chrome Extension</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${settings.integrations.aliExpress.connected ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                      {settings.integrations.aliExpress.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>

                {/* CJ Dropshipping */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-sm bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">CJ</div>
                    <div>
                      <h4 className="font-medium text-slate-900">CJ Dropshipping</h4>
                      <p className="text-xs text-slate-500">Direct warehousing and fulfillment sync</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${settings.integrations.cjDropshipping.connected ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                      {settings.integrations.cjDropshipping.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white p-8 border border-slate-100 shadow-sm space-y-6 animate-fade-in">
            <h3 className="text-lg font-medium text-slate-900 border-b border-slate-50 pb-4 mb-6">Email Preferences</h3>
            <Toggle 
              label="New Order Alerts" 
              description="Receive an email whenever a customer places a new order."
              checked={settings.notifications.orderEmail}
              onChange={(val) => setSettings({...settings, notifications: {...settings.notifications, orderEmail: val}})}
            />
            <Toggle 
              label="Low Stock Warnings" 
              description="Get notified when inventory drops below 5 units."
              checked={settings.notifications.lowStock}
              onChange={(val) => setSettings({...settings, notifications: {...settings.notifications, lowStock: val}})}
            />
            <div className="pt-4 border-t border-slate-100">
               <Toggle 
                label="Auto-Fulfill Orders" 
                description="Automatically route paid orders to connected suppliers (Risky)."
                checked={settings.autoFulfill}
                onChange={(val) => setSettings({...settings, autoFulfill: val})}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
