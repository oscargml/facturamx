import axios from 'axios';

const WHATSAPP_URL = 'https://graph.facebook.com/v21.0';

export class WhatsAppService {
  private phoneId: string;
  private accessToken: string;

  constructor(phoneId: string, accessToken: string) {
    this.phoneId = phoneId;
    this.accessToken = accessToken;
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async sendTextMessage(to: string, text: string) {
    const response = await axios.post(
      `${WHATSAPP_URL}/${this.phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: text },
      },
      { headers: this.headers }
    );
    return response.data;
  }

  async sendInteractiveButtons(to: string, text: string, buttons: Array<{ id: string; title: string }>) {
    const response = await axios.post(
      `${WHATSAPP_URL}/${this.phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: text },
          action: {
            buttons: buttons.map(b => ({
              type: 'reply',
              reply: { id: b.id, title: b.title }
            }))
          }
        },
      },
      { headers: this.headers }
    );
    return response.data;
  }
}
