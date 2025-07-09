import React from 'react';
import { DealDetailView } from './DealDetailView';
import { mockDeals } from '../data/mockDeals';
import { useContactStore } from '../store/contactStore';
import { Contact } from '../types/contact';

interface DealDetailProps {
  dealId: string;
  onClose: () => void;
}

const DealDetail: React.FC<DealDetailProps> = ({ dealId, onClose }) => {
  // Fetch contacts to provide the linked contact to DealDetailView
  const { contacts } = useContactStore();
  const deal = mockDeals[dealId];
  
  // Find the associated contact if available
  const contactData: Contact | null = deal?.contactId 
    ? contacts.find(c => c.id === deal.contactId) || null 
    : null;
  

  if (!deal) return null;

  return (
    <DealDetailView
      deal={deal}
      isOpen={true}
      onClose={onClose}
      onUpdate={async (id, updates) => {
        // In a real app, this would call an API to update the deal
        const updatedDeal = { ...deal, ...updates, updatedAt: new Date() };
        console.log('Updating deal:', id, updates);
        return updatedDeal;
      }}
      contactData={contactData}
    />
  );
};

export default DealDetail;