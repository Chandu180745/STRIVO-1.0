import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Users } from 'lucide-react';
import { SocialFeed } from '@/components/SocialFeed';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const spring = { type: 'spring' as const, stiffness: 300, damping: 25 };

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

const MOCK_CHATS = [
  { id: 'trainer', name: 'COACH MIKE', avatar: 'C', lastMsg: 'Great progress! Keep it up 💪', unread: 2 },
  { id: 'friend1', name: 'ALEX_FIT', avatar: 'A', lastMsg: 'Leg day tomorrow?', unread: 1 },
  { id: 'friend2', name: 'IRON_MAYA', avatar: 'M', lastMsg: 'Check my new PR!', unread: 0 },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', sender: 'COACH MIKE', text: 'How was your workout today?', time: '10:30 AM', isMe: false },
  { id: '2', sender: 'YOU', text: 'Crushed leg day! Hit a new squat PR 🔥', time: '10:32 AM', isMe: true },
  { id: '3', sender: 'COACH MIKE', text: 'Great progress! Keep it up 💪', time: '10:33 AM', isMe: false },
];

type Tab = 'feed' | 'messages';

const Community = () => {
  const [tab, setTab] = useState<Tab>('feed');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [msgInput, setMsgInput] = useState('');
  const { user } = useAuth();

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'YOU',
      text: msgInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }]);
    setMsgInput('');
    toast.success('Message sent');
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1">
        {([
          { id: 'feed' as Tab, label: 'FEED', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'messages' as Tab, label: 'MESSAGES', icon: <MessageCircle className="w-3.5 h-3.5" /> },
        ]).map(t => (
          <motion.button key={t.id} whileTap={{ scale: 0.95 }} onClick={() => { setTab(t.id); setActiveChat(null); }}
            className={`flex items-center gap-1.5 px-3 py-2 font-display text-[10px] tracking-wider border rounded-full transition-all ${
              tab === t.id ? 'bg-foreground text-background border-foreground' : 'border-foreground/20 text-muted-foreground'
            }`}>{t.icon}{t.label}</motion.button>
        ))}
      </div>

      {/* FEED */}
      {tab === 'feed' && <SocialFeed />}

      {/* MESSAGES */}
      {tab === 'messages' && !activeChat && (
        <div className="space-y-2">
          {MOCK_CHATS.map((chat, i) => (
            <motion.button key={chat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.05 }}
              onClick={() => setActiveChat(chat.id)}
              className="glass-card w-full text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center font-display text-sm shrink-0">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-display text-xs tracking-wider">{chat.name}</p>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-strivo-red text-white text-[9px] font-display rounded-full flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{chat.lastMsg}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* ACTIVE CHAT */}
      {tab === 'messages' && activeChat && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={spring}>
          <button onClick={() => setActiveChat(null)}
            className="font-display text-[10px] tracking-wider text-muted-foreground mb-3 hover:text-foreground transition-colors">
            ← BACK TO CHATS
          </button>
          <div className="glass-card">
            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-2 rounded text-xs ${
                    m.isMe ? 'bg-foreground/10' : 'bg-muted/50 border border-foreground/10'
                  }`}>
                    <p className="font-display text-[9px] tracking-wider text-muted-foreground mb-0.5">{m.sender} · {m.time}</p>
                    <p>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={msgInput} onChange={e => setMsgInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent border border-foreground/20 px-3 py-2 text-xs focus:outline-none focus:border-foreground/50 rounded" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage}
                className="p-2 bg-foreground text-background rounded">
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Community;
