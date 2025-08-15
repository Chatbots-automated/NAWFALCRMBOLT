import React from 'react';
import { Package, Plus, Edit, Trash2, DollarSign, Tag } from 'lucide-react';

const Products: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Elite Transformation Program',
      description: 'Complete 12-month elite coaching program for leaders and entrepreneurs',
      price: '$50,000',
      category: 'Coaching',
      status: 'active',
      sales: 12,
      revenue: '$600,000'
    },
    {
      id: 2,
      name: 'Elite Strategy Sessions',
      description: 'One-on-one strategic coaching sessions for high-performance execution',
      price: '$2,500',
      category: 'Coaching',
      status: 'active',
      sales: 45,
      revenue: '$112,500'
    },
    {
      id: 3,
      name: 'Elite Leadership Intensive',
      description: 'Intensive 3-day leadership transformation workshop',
      price: '$15,000',
      category: 'Training',
      status: 'active',
      sales: 8,
      revenue: '$120,000'
    },
    {
      id: 4,
      name: 'Elite Mastermind Access',
      description: 'Exclusive access to elite entrepreneur and leader mastermind group',
      price: '$25,000',
      category: 'Mastermind',
      status: 'draft',
      sales: 0,
      revenue: '$0'
    }
  ];

  const categories = ['All', 'Coaching', 'Training', 'Mastermind'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            FILALI ARSENAL
            <span className="block text-4xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-black">
              WEAPONS CACHE
            </span>
          </h1>
          <p className="text-gray-300 mt-2 font-semibold">ELITE WEAPONS FOR TOTAL DOMINATION.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  category === 'All' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                    : 'border border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
            <Plus size={16} />
            NEW PROGRAM
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-red-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Package className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Programs</span>
          </div>
          <p className="text-2xl font-bold text-white">4</p>
          <p className="text-sm text-green-400 mt-1">3 active</p>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-red-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-white">$832K</p>
          <p className="text-sm text-green-400 mt-1">+28% this month</p>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-red-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Tag className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">Total Clients</span>
          </div>
          <p className="text-2xl font-bold text-white">65</p>
          <p className="text-sm text-purple-400 mt-1">This quarter</p>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-red-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Package className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm font-medium text-gray-400">Top Program</span>
          </div>
          <p className="text-lg font-bold text-white">Elite Strategy</p>
          <p className="text-sm text-orange-400 mt-1">45 clients</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden hover:shadow-xl hover:shadow-red-500/20 transition-all duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-xl border border-red-500/40">
                    <Package className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                    <span className="text-sm text-gray-400">{product.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                  }`}>
                    {product.status}
                  </span>
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{product.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold text-red-400">{product.price}</p>
                  <p className="text-xs text-gray-400">Investment</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{product.sales} clients</p>
                  <p className="text-sm text-green-400">{product.revenue}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;