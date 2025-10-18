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

export type UserProfile = {
  id: string;
  name?: string;
  email: string;
  role?: 'user' | 'admin';
};

export type Sale = {
  id: string;
  amount: number;
  product: string;
  userId: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
};
