import axios from 'axios';

const FACTURAPI_URL = 'https://www.facturapi.io/v2';

export interface FacturapiCustomer {
  id: string;
  legal_name: string;
  tax_id: string;
  tax_system: string;
  address: {
    zip: string;
  };
}

export interface FacturapiInvoice {
  id: string;
  uuid: string;
  status: string;
  total: number;
  files: {
    pdf: string;
    xml: string;
  };
}

export class FacturapiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    };
  }

  async createCustomer(data: {
    legal_name: string;
    tax_id: string;
    tax_system: string;
    email?: string;
    zip: string;
  }): Promise<FacturapiCustomer> {
    const response = await axios.post(`${FACTURAPI_URL}/customers`, {
      legal_name: data.legal_name,
      tax_id: data.tax_id,
      tax_system: data.tax_system,
      email: data.email,
      address: {
        zip: data.zip,
      },
    }, { headers: this.headers });

    return response.data;
  }

  async getCustomerByTaxId(taxId: string): Promise<FacturapiCustomer | null> {
    const response = await axios.get(`${FACTURAPI_URL}/customers`, {
      params: { q: taxId },
      headers: this.headers,
    });

    const customers = response.data.data;
    return customers.length > 0 ? customers[0] : null;
  }

  async createInvoice(data: {
    customer_id: string;
    items: Array<{
      quantity: number;
      product: {
        description: string;
        product_key: string;
        price: number;
        tax_included?: boolean;
      };
    }>;
    payment_form: string;
    use?: string;
  }): Promise<FacturapiInvoice> {
    const response = await axios.post(`${FACTURAPI_URL}/invoices`, {
      customer: data.customer_id,
      items: data.items,
      payment_form: data.payment_form,
      use: data.use || 'G03', // Gastos en general
    }, { headers: this.headers });

    return response.data;
  }

  async downloadInvoice(invoiceId: string, format: 'pdf' | 'xml'): Promise<string> {
    return `${FACTURAPI_URL}/invoices/${invoiceId}/${format}`;
  }
}
