export type Inquiry = {
  id: string;
  title: string;
  userId: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  senderType: 'user' | 'bot';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};
