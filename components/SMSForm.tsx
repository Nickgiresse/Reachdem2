"use client"
  // components/SMSForm.tsx - Composant React pour l'interface
  import { useState } from 'react';
  
  interface SMSFormProps {
    onSuccess?: (result: any) => void;
    onError?: (error: string) => void;
  }
  
  export function SMSForm({ onSuccess, onError }: SMSFormProps) {
    const [formData, setFormData] = useState({
      sender: '',
      message: '',
      phone: '',
      type: 'single' as 'single' | 'bulk'
    });
    const [loading, setLoading] = useState(false);
    const [messageInfo, setMessageInfo] = useState({ length: 0, parts: 1 });
  
    const handleMessageChange = (message: string) => {
      const length = message.length;
      const parts = Math.ceil(length / 160);
      setMessageInfo({ length, parts });
      setFormData(prev => ({ ...prev, message }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const phone = formData.type === 'bulk' 
          ? formData.phone.split(',').map(p => p.trim())
          : formData.phone;
  
        const response = await fetch('/api/sms/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            phone
          }),
        });
  
        const result = await response.json();
  
        if (result.success) {
          onSuccess?.(result);
          // Reset form
          setFormData({
            sender: '',
            message: '',
            phone: '',
            type: 'single'
          });
          setMessageInfo({ length: 0, parts: 1 });
        } else {
          onError?.(result.error || 'Erreur lors de l\'envoi');
        }
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium mb-1">
            Type d'envoi
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              type: e.target.value as 'single' | 'bulk' 
            }))}
            className="w-full p-2 border rounded"
          >
            <option value="single">SMS unique</option>
            <option value="bulk">SMS en masse</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">
            Expéditeur (max 11 caractères)
          </label>
          <input
            type="text"
            value={formData.sender}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              sender: e.target.value.substring(0, 11) 
            }))}
            className="w-full p-2 border rounded"
            placeholder="MonApp"
            maxLength={11}
            required
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">
            Numéro(s) de téléphone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-2 border rounded"
            placeholder={
              formData.type === 'bulk' 
                ? "+237670000000, +237680000001" 
                : "+237670000000"
            }
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.type === 'bulk' 
              ? "Séparez les numéros par des virgules" 
              : "Format: +237XXXXXXXXX"}
          </p>
        </div>
  
        <div>
          <label className="block text-sm font-medium mb-1">
            Message ({messageInfo.length}/160 - {messageInfo.parts} SMS)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleMessageChange(e.target.value)}
            className="w-full p-2 border rounded h-24"
            placeholder="Votre message ici..."
            maxLength={1600}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {messageInfo.parts > 1 && `Ce message sera envoyé en ${messageInfo.parts} parties`}
          </p>
        </div>
  
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer SMS'}
        </button>
      </form>
    );
  }