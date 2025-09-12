import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Settings, 
  Shield, 
  Bell, 
  Eye, 
  Lock, 
  Smartphone,
  Mail,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

interface AccountSettingsProps {
  user: any;
  onClose: () => void;
  onSave: (settings: any) => void;
}

export function AccountSettings({ user, onClose, onSave }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState('security');
  const [settings, setSettings] = useState({
    // Security Settings
    twoFactorEnabled: user.twoFactorEnabled || false,
    emailNotifications: user.emailNotifications || true,
    smsNotifications: user.smsNotifications || false,
    loginAlerts: user.loginAlerts || true,
    
    // Privacy Settings
    profileVisibility: user.profileVisibility || 'team',
    dataSharing: user.dataSharing || false,
    analyticsTracking: user.analyticsTracking || true,
    
    // Notification Settings
    assessmentAlerts: user.assessmentAlerts || true,
    clientUpdates: user.clientUpdates || true,
    systemUpdates: user.systemUpdates || true,
    marketingEmails: user.marketingEmails || false,
    
    // Password
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSave}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  
                  {/* Two-Factor Authentication */}
                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {settings.twoFactorEnabled && (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Enabled
                          </Badge>
                        )}
                        <Switch
                          checked={settings.twoFactorEnabled}
                          onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                        />
                      </div>
                    </div>
                  </Card>

                  {/* Login Alerts */}
                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Login Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.loginAlerts}
                        onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                      />
                    </div>
                  </Card>

                  {/* Change Password */}
                  <Card className="p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={settings.currentPassword}
                          onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={settings.newPassword}
                          onChange={(e) => handleSettingChange('newPassword', e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={settings.confirmPassword}
                          onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </div>
                      <Button className="bg-red-600 hover:bg-red-700 text-white">
                        <Lock className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                  
                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                          <p className="text-sm text-gray-600">Control who can see your profile information</p>
                        </div>
                      </div>
                      <select 
                        value={settings.profileVisibility}
                        onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                        className="px-3 py-1 border border-gray-200 rounded-md text-sm"
                      >
                        <option value="public">Public</option>
                        <option value="team">Team Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </Card>

                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Data Sharing</h4>
                          <p className="text-sm text-gray-600">Allow anonymous data sharing for platform improvement</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.dataSharing}
                        onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
                      />
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Analytics Tracking</h4>
                          <p className="text-sm text-gray-600">Help us improve your experience with usage analytics</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.analyticsTracking}
                        onCheckedChange={(checked) => handleSettingChange('analyticsTracking', checked)}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  
                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive important updates via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                  </Card>

                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">Receive urgent alerts via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                      />
                    </div>
                  </Card>

                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Assessment Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified when clients complete assessments</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.assessmentAlerts}
                        onCheckedChange={(checked) => handleSettingChange('assessmentAlerts', checked)}
                      />
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                          <p className="text-sm text-gray-600">Receive product updates and promotional content</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  
                  <Card className="p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Export Data</h4>
                          <p className="text-sm text-gray-600">Download a copy of your account data</p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-red-900">Delete Account</h4>
                          <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
