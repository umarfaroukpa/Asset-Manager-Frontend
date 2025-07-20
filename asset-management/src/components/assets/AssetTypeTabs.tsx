// components/assets/AssetTypeTabs.tsx
import React, { useState } from 'react';
import { 
  Package, 
  Monitor, 
  Car, 
  Smartphone, 
  Key, 
  Server,
  Home,
  Book,
  Tool,
  Printer
} from 'lucide-react';
import PhysicalAssetForm from './PhysicalAssetForm';
import DigitalAssetForm from './';
import VehicleAssetForm from './';

const AssetTypeTabs = ({ onSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState('physical');
  
  const assetTypes = [
    {
      id: 'physical',
      name: 'Physical Assets',
      icon: <Package className="w-5 h-5" />,
      description: 'Equipment, furniture, tools, etc.',
      component: <PhysicalAssetForm onSubmit={onSubmit} onCancel={onCancel} />
    },
    {
      id: 'digital',
      name: 'Digital Assets',
      icon: <Monitor className="w-5 h-5" />,
      description: 'Software licenses, domains, etc.',
      component: <DigitalAssetForm onSubmit={onSubmit} onCancel={onCancel} />
    },
    {
      id: 'vehicle',
      name: 'Vehicles',
      icon: <Car className="w-5 h-5" />,
      description: 'Cars, trucks, fleet vehicles',
      component: <VehicleAssetForm onSubmit={onSubmit} onCancel={onCancel} />
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Phones, computers, devices',
      component: <PhysicalAssetForm onSubmit={onSubmit} onCancel={onCancel} />
    },
    {
      id: 'access',
      name: 'Access',
      icon: <Key className="w-5 h-5" />,
      description: 'Keys, badges, access cards',
      component: <PhysicalAssetForm onSubmit={onSubmit} onCancel={onCancel} />
    },
    {
      id: 'it',
      name: 'IT Equipment',
      icon: <Server className="w-5 h-5" />,
      description: 'Servers, network gear',
      component: <PhysicalAssetForm onSubmit={onSubmit} onCancel={onCancel} />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto -mb-px">
          {assetTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === type.id
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {assetTypes.find(t => t.id === activeTab)?.name}
          </h3>
          <p className="text-sm text-gray-500">
            {assetTypes.find(t => t.id === activeTab)?.description}
          </p>
        </div>
        
        {assetTypes.find(t => t.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default AssetTypeTabs;