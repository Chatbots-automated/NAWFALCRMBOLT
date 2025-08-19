export interface StripeProduct {
  id: string;
  object: string;
  active: boolean;
  created: number;
  default_price: string;
  description: string;
  name: string;
  type: string;
  updated: number;
}

export interface StripePrice {
  id: string;
  object: string;
  active: boolean;
  currency: string;
  product: string;
  type: string;
  unit_amount: number;
  recurring?: {
    interval: string;
    interval_count: number;
  };
}

export interface StripeTransaction {
  product_id: string;
  session_id: string;
  created_unix: number;
  created_iso: string;
  quantity: number;
  amount_total: number;
  currency: string;
  price_id: string | null;
  description: string | null;
  customer_email: string | null;
  customer_id: string | null;
  payment_intent_id: string | null;
  payment_link_id: string;
}

export interface ProductSummary {
  product_id: string;
  links: string[];
  totals: {
    orders: number;
    revenue: number;
    unique_buyers: number;
  };
  transactions: StripeTransaction[];
  product?: StripeProduct;
  prices?: StripePrice[];
}

export interface CatalogResponse {
  count_products: number;
  products: ProductSummary[];
  _meta: {
    total_payment_links: number;
    filters: {
      active: boolean;
      created_gte: number | null;
      created_lte: number | null;
    };
  };
}

export interface CatalogFilters {
  active?: boolean;
  created_gte?: number;
  created_lte?: number;
  product_ids?: string[];
  include_products?: boolean | number;
  include_prices?: boolean | number;
  maxPages?: number;
}

class StripeService {
  private readonly apiUrl = 'https://nawfalfilalicrm.vercel.app/api/transactions-by-link.js';

  async getCatalogData(filters: CatalogFilters = {}): Promise<CatalogResponse> {
    try {
      const params = new URLSearchParams();
      
      // Set default values
      if (filters.active !== undefined) params.set('active', String(filters.active));
      if (filters.created_gte) params.set('created_gte', String(filters.created_gte));
      if (filters.created_lte) params.set('created_lte', String(filters.created_lte));
      if (filters.include_products !== undefined) params.set('include_products', filters.include_products ? '1' : '0');
      if (filters.include_prices !== undefined) params.set('include_prices', filters.include_prices ? '1' : '0');
      if (filters.maxPages) params.set('maxPages', String(filters.maxPages));
      
      // Handle product_ids array
      if (filters.product_ids && filters.product_ids.length > 0) {
        filters.product_ids.forEach(id => params.append('product_ids[]', id));
      }

      // Default to include products and prices for full data
      if (!params.has('include_products')) params.set('include_products', '1');
      if (!params.has('include_prices')) params.set('include_prices', '1');

      const url = `${this.apiUrl}?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: filters.active,
          created_gte: filters.created_gte,
          created_lte: filters.created_lte,
          product_ids: filters.product_ids,
          include_products: filters.include_products ? 1 : 0,
          include_prices: filters.include_prices ? 1 : 0,
          maxPages: filters.maxPages
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CatalogResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch Stripe catalog data:', error);
      throw error;
    }
  }

  async getAllTransactions(filters: CatalogFilters = {}): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    totalProducts: number;
    totalCustomers: number;
    productSummaries: ProductSummary[];
    allTransactions: StripeTransaction[];
    revenueByProduct: { [productId: string]: number };
    transactionsByProduct: { [productId: string]: StripeTransaction[] };
  }> {
    try {
      const catalogData = await this.getCatalogData(filters);
      
      let totalRevenue = 0;
      let totalTransactions = 0;
      const allTransactions: StripeTransaction[] = [];
      const revenueByProduct: { [productId: string]: number } = {};
      const transactionsByProduct: { [productId: string]: StripeTransaction[] } = {};
      const allCustomers = new Set<string>();

      catalogData.products.forEach(product => {
        totalRevenue += product.totals.revenue;
        totalTransactions += product.totals.orders;
        
        revenueByProduct[product.product_id] = product.totals.revenue;
        transactionsByProduct[product.product_id] = product.transactions;
        
        allTransactions.push(...product.transactions);
        
        // Track unique customers
        product.transactions.forEach(transaction => {
          if (transaction.customer_email) {
            allCustomers.add(transaction.customer_email);
          }
        });
      });

      // Sort all transactions by date (newest first)
      allTransactions.sort((a, b) => b.created_unix - a.created_unix);

      return {
        totalRevenue,
        totalTransactions,
        totalProducts: catalogData.count_products,
        totalCustomers: allCustomers.size,
        productSummaries: catalogData.products,
        allTransactions,
        revenueByProduct,
        transactionsByProduct
      };
    } catch (error) {
      console.error('Failed to fetch all transactions:', error);
      throw error;
    }
  }

  async getRevenueByPeriod(
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    filters: CatalogFilters = {}
  ): Promise<{ labels: string[]; data: number[] }> {
    try {
      const { allTransactions } = await this.getAllTransactions(filters);
      
      const periods: { [key: string]: number } = {};
      
      allTransactions.forEach(transaction => {
        const date = new Date(transaction.created_unix * 1000);
        let key: string;
        
        switch (period) {
          case 'day':
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
            break;
          case 'week':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().split('T')[0];
            break;
          case 'month':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          case 'year':
            key = String(date.getFullYear());
            break;
          default:
            key = date.toISOString().split('T')[0];
        }
        
        periods[key] = (periods[key] || 0) + transaction.amount_total;
      });
      
      const sortedKeys = Object.keys(periods).sort();
      return {
        labels: sortedKeys,
        data: sortedKeys.map(key => periods[key])
      };
    } catch (error) {
      console.error('Failed to get revenue by period:', error);
      throw error;
    }
  }

  // Helper methods for date filtering
  getUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
  }

  getLast30DaysFilter(): CatalogFilters {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      created_gte: this.getUnixTimestamp(thirtyDaysAgo),
      created_lte: this.getUnixTimestamp(now)
    };
  }

  getThisMonthFilter(): CatalogFilters {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      created_gte: this.getUnixTimestamp(startOfMonth),
      created_lte: this.getUnixTimestamp(now)
    };
  }

  getThisYearFilter(): CatalogFilters {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    
    return {
      created_gte: this.getUnixTimestamp(startOfYear),
      created_lte: this.getUnixTimestamp(now)
    };
  }

  formatCurrency(amount: number, currency: string = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  formatDate(unixTimestamp: number): string {
    return new Date(unixTimestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCompactCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  }

  // Get top performing products
  getTopProducts(productSummaries: ProductSummary[], limit: number = 5): ProductSummary[] {
    return productSummaries
      .filter(p => p.totals.orders > 0) // Only products with actual sales
      .sort((a, b) => b.totals.revenue - a.totals.revenue)
      .slice(0, limit);
  }

  // Get recent transactions across all products
  getRecentTransactions(productSummaries: ProductSummary[], limit: number = 10): StripeTransaction[] {
    const allTransactions = productSummaries.flatMap(p => p.transactions);
    return allTransactions
      .sort((a, b) => b.created_unix - a.created_unix)
      .slice(0, limit);
  }

  // Calculate conversion metrics
  getConversionMetrics(productSummaries: ProductSummary[]): {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    topProduct: ProductSummary | null;
  } {
    const totalRevenue = productSummaries.reduce((sum, p) => sum + p.totals.revenue, 0);
    const totalOrders = productSummaries.reduce((sum, p) => sum + p.totals.orders, 0);
    const totalCustomers = productSummaries.reduce((sum, p) => sum + p.totals.unique_buyers, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const topProduct = productSummaries
      .filter(p => p.totals.revenue > 0)
      .sort((a, b) => b.totals.revenue - a.totals.revenue)[0] || null;

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      topProduct
    };
  }
}

export const stripeService = new StripeService();