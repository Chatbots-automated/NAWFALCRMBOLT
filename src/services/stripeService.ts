export interface StripeTransaction {
  session_id: string;
  created_unix: number;
  created_iso: string;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  customer_id: string | null;
  payment_intent_id: string | null;
  price_ids: string[];
  product_ids: string[];
  lines: {
    description: string | null;
    quantity: number;
    amount_total: number;
    currency: string;
    price_id: string | null;
    product_id: string | null;
  }[];
}

export interface StripeResponse {
  payment_link_id: string;
  count: number;
  transactions: StripeTransaction[];
}

export interface PaymentLink {
  id: string;
  name: string;
  url: string;
  description?: string;
}

class StripeService {
  private readonly apiUrl = 'https://nawfalfilalicrm.vercel.app/api/transactions-by-link';
  
  // Payment links configuration - easily changeable
  private paymentLinks: PaymentLink[] = [
    {
      id: 'test-course',
      name: 'Operator to Coach Course (TEST)',
      url: 'https://buy.stripe.com/dRmaEP6c41sF8he8Ca6sw02',
      description: 'Test course for development'
    },
    // Add more payment links here as needed
    // {
    //   id: 'elite-program',
    //   name: 'Elite Transformation Program',
    //   url: 'https://buy.stripe.com/YOUR_ELITE_PROGRAM_LINK',
    //   description: 'Complete elite coaching program'
    // }
  ];

  async getTransactionsByUrl(paymentUrl: string): Promise<StripeResponse> {
    try {
      const encodedUrl = encodeURIComponent(paymentUrl);
      const response = await fetch(`${this.apiUrl}?url=${encodedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StripeResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch Stripe transactions:', error);
      throw error;
    }
  }

  async getTransactionsByPaymentLinkId(paymentLinkId: string): Promise<StripeResponse> {
    try {
      const response = await fetch(`${this.apiUrl}?plink_id=${paymentLinkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StripeResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch Stripe transactions:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    transactionsByProduct: { [key: string]: StripeTransaction[] };
    allTransactions: StripeTransaction[];
  }> {
    try {
      const results = await Promise.allSettled(
        this.paymentLinks.map(link => this.getTransactionsByUrl(link.url))
      );

      let totalRevenue = 0;
      let totalTransactions = 0;
      const transactionsByProduct: { [key: string]: StripeTransaction[] } = {};
      const allTransactions: StripeTransaction[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value;
          const link = this.paymentLinks[index];
          
          totalRevenue += data.transactions.reduce((sum, t) => sum + t.amount_total, 0);
          totalTransactions += data.count;
          
          transactionsByProduct[link.name] = data.transactions;
          allTransactions.push(...data.transactions);
        } else {
          console.error(`Failed to fetch transactions for ${this.paymentLinks[index].name}:`, result.reason);
        }
      });

      // Sort all transactions by date (newest first)
      allTransactions.sort((a, b) => b.created_unix - a.created_unix);

      return {
        totalRevenue,
        totalTransactions,
        transactionsByProduct,
        allTransactions
      };
    } catch (error) {
      console.error('Failed to fetch all transactions:', error);
      throw error;
    }
  }

  getPaymentLinks(): PaymentLink[] {
    return this.paymentLinks;
  }

  addPaymentLink(link: PaymentLink): void {
    this.paymentLinks.push(link);
  }

  removePaymentLink(id: string): void {
    this.paymentLinks = this.paymentLinks.filter(link => link.id !== id);
  }

  updatePaymentLink(id: string, updates: Partial<PaymentLink>): void {
    const index = this.paymentLinks.findIndex(link => link.id === id);
    if (index !== -1) {
      this.paymentLinks[index] = { ...this.paymentLinks[index], ...updates };
    }
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

  getRevenueByPeriod(transactions: StripeTransaction[], period: 'day' | 'week' | 'month' | 'year' = 'month'): {
    labels: string[];
    data: number[];
  } {
    const now = new Date();
    const periods: { [key: string]: number } = {};
    
    transactions.forEach(transaction => {
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
  }
}

export const stripeService = new StripeService();