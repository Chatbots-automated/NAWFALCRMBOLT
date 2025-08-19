import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, DollarSign, Tag, RefreshCw, ExternalLink, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { stripeService, ProductSummary } from '../services/stripeService';

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeProducts: 0
  });

  useEffect(() => {
    fetchProducts();
  }, [showActiveOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const catalogData = await stripeService.getCatalogData({
        active: showActiveOnly,
        include_products: true,
        include_prices: true
      });
      
      setProducts(catalogData.products);
      
      // Calculate stats
      const metrics = stripeService.getConversionMetrics(catalogData.products);
      const activeProducts = catalogData.products.filter(p => p.product?.active).length;
      
      setStats({
        totalProducts: catalogData.count_products,
        totalRevenue: metrics.totalRevenue,
        totalOrders: metrics.totalOrders,
        totalCustomers: metrics.totalCustomers,
        activeProducts
      });
      
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products from Stripe');
    } finally {
      setLoading(false);
    }
  };

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
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="rounded border-red-500/30 bg-black/30 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm font-medium">Active Products Only</span>
          </label>
          <button 
            onClick={fetchProducts}
            disabled={loading}
            className="px-6 py-3 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors text-gray-300 hover:text-white font-medium disabled:opacity-50"
          >
            <RefreshCw size={16} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <a
            href="https://dashboard.stripe.com/products"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
          >
            <ExternalLink size={16} />
            STRIPE PRODUCTS
          </a>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 font-semibold">
            <Plus size={16} />
            NEW PRODUCT
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Products',
            value: loading ? '...' : stats.totalProducts.toString(),
            subtitle: `${stats.activeProducts} active`,
            icon: Package,
            color: 'bg-red-500/20',
            iconColor: 'text-red-400'
          },
          {
            title: 'Total Revenue',
            value: loading ? '...' : stripeService.formatCurrency(stats.totalRevenue),
            subtitle: `${stats.totalOrders} orders`,
            icon: DollarSign,
            color: 'bg-green-500/20',
            iconColor: 'text-green-400'
          },
          {
            title: 'Elite Customers',
            value: loading ? '...' : stats.totalCustomers.toString(),
            subtitle: 'Unique buyers',
            icon: Users,
            color: 'bg-purple-500/20',
            iconColor: 'text-purple-400'
          },
          {
            title: 'Top Product',
            value: loading ? '...' : (() => {
              const topProduct = stripeService.getTopProducts(products, 1)[0];
              if (!topProduct) return 'None';
              const name = topProduct.product?.name || 'Unknown';
              return name.split(' ').slice(0, 2).join(' ');
            })(),
            subtitle: loading ? '...' : (() => {
              const topProduct = stripeService.getTopProducts(products, 1)[0];
              return topProduct ? `${topProduct.totals.orders} sales` : 'No sales';
            })(),
            icon: TrendingUp,
            color: 'bg-orange-500/20',
            iconColor: 'text-orange-400'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-black/60 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-red-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 ${stat.color} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-400">{stat.title}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-green-400 mt-1">{stat.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">ELITE PRODUCT CATALOG</h2>
              <p className="text-gray-400 text-sm mt-1">Live data from Stripe products</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/40 font-medium">
                Live Stripe Data
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
              </div>
              <span className="ml-4 text-white font-semibold">Loading Stripe products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/40">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Failed to Load Products</h3>
              <p className="text-red-400 mb-6 font-medium">{error}</p>
              <button 
                onClick={fetchProducts}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold">
                Retry Loading
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-500/40">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400 mb-6">
                {showActiveOnly ? 'No active products found in Stripe' : 'No products found in Stripe'}
              </p>
              <a
                href="https://dashboard.stripe.com/products"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
              >
                <Plus size={16} />
                CREATE IN STRIPE
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.product_id} className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-sm border border-red-500/20 overflow-hidden hover:shadow-xl hover:shadow-red-500/20 transition-all duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-xl border border-red-500/40">
                          <Package className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{product.product?.name || `Product ${product.product_id.slice(-4)}`}</h3>
                          <span className="text-sm text-gray-400">{product.product?.type || 'service'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.product?.active 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                        }`}>
                          {product.product?.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <div className="flex gap-1">
                          <a
                            href={`https://dashboard.stripe.com/products/${product.product_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                          >
                            <Edit size={16} />
                          </a>
                          <a
                            href={`https://dashboard.stripe.com/products/${product.product_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {product.product?.description && (
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {product.product.description}
                      </p>
                    )}
                    
                    {/* Product Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-lg font-bold text-white">{product.totals.orders}</p>
                        <p className="text-xs text-gray-400">Orders</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-lg font-bold text-green-400">{stripeService.formatCurrency(product.totals.revenue)}</p>
                        <p className="text-xs text-gray-400">Revenue</p>
                      </div>
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <p className="text-lg font-bold text-purple-400">{product.totals.unique_buyers}</p>
                        <p className="text-xs text-gray-400">Customers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Package size={14} />
                        <span>{product.links?.length || 0} payment link{(product.links?.length || 0) !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          Avg: {product.totals.orders > 0 ? stripeService.formatCurrency(product.totals.revenue / product.totals.orders) : '$0'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;