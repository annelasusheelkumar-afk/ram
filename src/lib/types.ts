export type Inquiry = {
  id: string;
  title: string;
  userId: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  message: string;
  userId: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
};
