// lib/sms/mboaSmsClient.ts
interface SMSResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
    messageId?: string;
  }
  
  interface SMSRequest {
    sender: string;
    message: string;
    phone: string | string[];
  }
  
  export class MboaSMSClient {
    private readonly userID: string;
    private readonly password: string;
    private readonly baseURL = "https://mboadeals.net/api/v1/sms";
  
    constructor() {
      this.userID = process.env.NEXT_PUBLIC_MBOA_SMS_USERID!;
      this.password = process.env.NEXT_PUBLIC_MBOA_SMS_API_PASSWORD!;
      
      if (!this.userID || !this.password) {
        throw new Error("MboaSMS credentials not found in environment variables");
      }
    }
  
    /**
     * Valider un numéro de téléphone camerounais
     */
    validatePhoneNumber(phone: string): boolean {
      // Nettoyer le numéro
      const cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // Patterns pour les numéros camerounais
      const patterns = [
        /^\+237[67]\d{8}$/, // +237XXXXXXXXX
        /^237[67]\d{8}$/,   // 237XXXXXXXXX
        /^[67]\d{8}$/,      // XXXXXXXXX
        /^0[67]\d{8}$/      // 0XXXXXXXXX
      ];
      
      return patterns.some(pattern => pattern.test(cleaned));
    }
  
    /**
     * Formater un numéro au format requis par l'API
     */
    formatPhoneNumber(phone: string): string {
      let cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // Supprimer le 0 initial si présent
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      
      // Ajouter 237 si pas présent
      if (cleaned.match(/^[67]\d{8}$/)) {
        return `237${cleaned}`;
      } else if (cleaned.startsWith('+237')) {
        return cleaned.substring(1); // Supprimer le +
      } else if (cleaned.startsWith('237')) {
        return cleaned;
      }
      
      return cleaned;
    }
  
    /**
     * Valider la longueur du message SMS
     */
    validateMessage(message: string): { valid: boolean; length: number; parts: number } {
      const length = message.length;
      const parts = Math.ceil(length / 160); // SMS standard = 160 caractères
      
      return {
        valid: length > 0 && length <= 1600, // Max 10 SMS concatenés
        length,
        parts
      };
    }
  
    /**
     * Envoyer un SMS unique
     */
    async sendSingleSMS({ sender, message, phone }: Omit<SMSRequest, 'phone'> & { phone: string }): Promise<SMSResponse> {
      try {
        // Validation des données
        if (!this.validatePhoneNumber(phone)) {
          return {
            success: false,
            error: `Numéro de téléphone invalide: ${phone}`
          };
        }
  
        const messageValidation = this.validateMessage(message);
        if (!messageValidation.valid) {
          return {
            success: false,
            error: `Message invalide. Longueur: ${messageValidation.length} caractères`
          };
        }
  
        const formattedPhone = this.formatPhoneNumber(phone);
        
        const response = await fetch(`${this.baseURL}/sendsms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: this.userID,
            password: this.password,
            message: message.trim(),
            phone_str: formattedPhone,
            sender_name: sender.substring(0, 11), // Limite souvent à 11 caractères
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          return {
            success: false,
            error: `HTTP ${response.status}: ${errorData}`
          };
        }
  
        const data = await response.json();
        
        return {
          success: true,
          message: "SMS envoyé avec succès",
          data,
          messageId: data.id || data.message_id // Selon la réponse de l'API
        };
  
      } catch (error) {
        return {
          success: false,
          error: `Erreur réseau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        };
      }
    }
  
    /**
     * Envoyer des SMS en masse (séquentiellement pour éviter la surcharge)
     */
    async sendBulkSMS({ sender, message, phone }: Omit<SMSRequest, 'phone'> & { phone: string[] }): Promise<SMSResponse[]> {
      const results: SMSResponse[] = [];
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
      for (let i = 0; i < phone.length; i++) {
        const result = await this.sendSingleSMS({
          sender,
          message,
          phone: phone[i]
        });
        
        results.push({
          ...result,
          data: { ...result.data, originalIndex: i, phone: phone[i] }
        });
  
        // Délai entre les envois pour éviter les limites de débit
        if (i < phone.length - 1) {
          await delay(1000); // 1 seconde entre chaque SMS
        }
      }
  
      return results;
    }
  
    /**
     * Envoyer des SMS en masse avec gestion par batch
     */
    async sendBatchSMS({ 
      sender, 
      message, 
      phone, 
      batchSize = 5 
    }: Omit<SMSRequest, 'phone'> & { 
      phone: string[]; 
      batchSize?: number; 
    }): Promise<{
      total: number;
      successful: number;
      failed: number;
      results: SMSResponse[];
    }> {
      const results: SMSResponse[] = [];
      const batches = [];
      
      // Diviser en batches
      for (let i = 0; i < phone.length; i += batchSize) {
        batches.push(phone.slice(i, i + batchSize));
      }
  
      // Traiter chaque batch
      for (const batch of batches) {
        const batchResults = await this.sendBulkSMS({
          sender,
          message,
          phone: batch
        });
        results.push(...batchResults);
      }
  
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
  
      return {
        total: results.length,
        successful,
        failed,
        results
      };
    }
  }
  
  // Singleton instance
  let mboaSMSClient: MboaSMSClient | null = null;
  
  export function getMboaSMSClient(): MboaSMSClient {
    if (!mboaSMSClient) {
      mboaSMSClient = new MboaSMSClient();
    }
    return mboaSMSClient;
  }
  
  // Fonction utilitaire simplifiée (compatible avec votre code existant)
  export async function sendSMS(sender: string, message: string, phone: string): Promise<any> {
    const client = getMboaSMSClient();
    const result = await client.sendSingleSMS({ sender, message, phone });
    
    if (!result.success) {
      throw new Error(result.error || "Failed to send SMS");
    }
    
    return result.data;
  }
  
 