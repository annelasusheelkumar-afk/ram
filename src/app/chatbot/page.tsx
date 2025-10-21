import ChatPanel from '@/components/chatbot/chat-panel';

export default function ChatbotPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Chatbot</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatPanel />
      </div>
    </div>
  );
}
