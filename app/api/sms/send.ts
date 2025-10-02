 // pages/api/sms/send.ts - API Route pour l'envoi de SMS
 import { NextApiRequest, NextApiResponse } from 'next';
 import { getMboaSMSClient } from '../../../lib/sms/mboaSmsClient';
 
 interface SendSMSRequest {
   sender: string;
   message: string;
   phone: string | string[];
   type?: 'single' | 'bulk';
 }
 
 export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
     return res.status(405).json({ error: 'Method not allowed' });
   }
 
   try {
     const { sender, message, phone, type = 'single' }: SendSMSRequest = req.body;
 
     // Validation des données requises
     if (!sender || !message || !phone) {
       return res.status(400).json({
         error: 'Champs requis manquants: sender, message, phone'
       });
     }
 
     const client = getMboaSMSClient();
 
     if (type === 'bulk' && Array.isArray(phone)) {
       // Envoi en masse
       const result = await client.sendBatchSMS({
         sender,
         message,
         phone,
         batchSize: 5
       });
 
       return res.status(200).json({
         success: true,
         message: `${result.successful}/${result.total} SMS envoyés avec succès`,
         data: result
       });
     } else {
       // Envoi unique
       const phoneStr = Array.isArray(phone) ? phone[0] : phone;
       const result = await client.sendSingleSMS({
         sender,
         message,
         phone: phoneStr
       });
 
       if (result.success) {
         return res.status(200).json(result);
       } else {
         return res.status(400).json(result);
       }
     }
   } catch (error) {
     console.error('SMS API Error:', error);
     return res.status(500).json({
       error: 'Erreur interne du serveur',
       details: error instanceof Error ? error.message : 'Erreur inconnue'
     });
   }
 }
