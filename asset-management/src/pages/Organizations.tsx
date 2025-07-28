import React, { useState, useEffect } from 'react';
import { Building, Users, Settings, Edit, Save, X, Mail, Phone, Globe, MapPin, Calendar, UserPlus, Shield, Activity, AlertTriangle, Trash2} from 'lucide-react';
import { getOrganization, getOrganizationMembers } from '../services/api';
  
  
   interface OrganizationSettings {
  allowPublicProfile: boolean;
  requireApprovalForMembers: boolean;
  enableTwoFactor: boolean;
  allowDataExport: boolean;
  enableApiAccess: boolean;
}

interface Organization {
  id: number;
  name: string;
  description: string;
  industry: string;
  size: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  foundedDate: string;
  logo: string | null;
  settings: OrganizationSettings;
}

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  status: string;
  avatar: string | null;
}

const OrganizationPage = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState<Organization | null>(null);

  // useEffect with API calls
  useEffect(() => {
    const fetchOrganizationData = async () => {
      setLoading(true);
      try {
        const orgData = await getOrganization();
        setOrganization(orgData.organization || orgData);
        setFormData(orgData.organization || orgData);
        const membersData = await getOrganizationMembers();
        setMembers(membersData.members || membersData);
      } catch (err) {
        console.error('Failed to fetch organization data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizationData();
  }, []);

  useEffect(() => {
    if (organization) {
      setFormData({...organization});
    }
  }, [organization]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };

  const handleSave = () => {
    if (formData) {
      setOrganization({...formData});
      setEditMode(false);
      // Letter on here I would typically make an API call to save the data
    }
  };

  const handleSettingToggle = (settingName: keyof OrganizationSettings) => {
    setOrganization(prev => prev ? ({
      ...prev,
      settings: {
        ...prev.settings,
        [settingName]: !prev.settings[settingName]
      }
    }) : null);
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string): string => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const removeMember = (memberId: number): void => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{organization?.name}</h1>
                  <p className="text-gray-600">{organization?.description}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData(organization ? {...organization} : null);
                      }}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Building },
                { id: 'members', label: 'Members', icon: Users },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={formData?.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{organization?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    {editMode ? (
                      <input
                        type="text"
                        name="industry"
                        value={formData?.industry || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{organization?.industry}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    {editMode ? (
                      <textarea
                        name="description"
                        value={formData?.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{organization?.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={formData?.email || ''}
                            onChange={handleInputChange}
                            className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <p className="text-gray-900">{organization?.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        {editMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <p className="text-gray-900">{organization?.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        {editMode ? (
                          <input
                            type="url"
                            name="website"
                            value={formData?.website || ''}
                            onChange={handleInputChange}
                            className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <a href={organization?.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {organization?.website}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        {editMode ? (
                          <textarea
                            name="address"
                            value={formData?.address || ''}
                            onChange={handleInputChange}
                            rows={2}
                            className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm w-full"
                          />
                        ) : (
                          <p className="text-gray-900">{organization?.address}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Founded</p>
                        {editMode ? (
                          <input
                            type="date"
                            name="foundedDate"
                            value={formData?.foundedDate || ''}
                            onChange={handleInputChange}
                            className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {new Date(organization?.foundedDate || '').toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Company Size</p>
                        {editMode ? (
                          <select
                            name="size"
                            value={formData?.size || ''}
                            onChange={handleInputChange}
                            className="mt-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="1-10 employees">1-10 employees</option>
                            <option value="11-50 employees">11-50 employees</option>
                            <option value="50-200 employees">50-200 employees</option>
                            <option value="200-1000 employees">200-1000 employees</option>
                            <option value="1000+ employees">1000+ employees</option>
                          </select>
                        ) : (
                          <p className="text-gray-900">{organization?.size}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                    <p className="text-sm text-gray-500">{members.length} total members</p>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 relative">
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Role:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Department:</span>
                          <span className="text-sm text-gray-900">{member.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                            {member.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Joined:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(member.joinDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Organization Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Public Profile</h4>
                      <p className="text-sm text-gray-500">Make organization profile visible to public</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={organization?.settings?.allowPublicProfile}
                        onChange={() => handleSettingToggle('allowPublicProfile')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Member Approval</h4>
                      <p className="text-sm text-gray-500">Require approval for new members</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={organization?.settings?.requireApprovalForMembers}
                        onChange={() => handleSettingToggle('requireApprovalForMembers')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-gray-500">Require 2FA for all organization members</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={organization?.settings?.enableTwoFactor}
                        onChange={() => handleSettingToggle('enableTwoFactor')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Activity className="w-4 h-4 mr-2" />
                        Data Export
                      </h4>
                      <p className="text-sm text-gray-500">Allow members to export their data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={organization?.settings?.allowDataExport}
                        onChange={() => handleSettingToggle('allowDataExport')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">API Access</h4>
                      <p className="text-sm text-gray-500">Enable API access for third-party integrations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={organization?.settings?.enableApiAccess}
                        onChange={() => handleSettingToggle('enableApiAccess')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-red-600 flex items-center mb-4">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Danger Zone
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-red-800">Delete Organization</h5>
                        <p className="text-sm text-red-600">
                          Permanently delete this organization and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Organization
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;