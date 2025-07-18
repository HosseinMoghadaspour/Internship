import React, { useState } from 'react';
import Picker, { type EmojiClickData } from 'emoji-picker-react'; // "type" اضافه شد
import { Send, Smile } from 'lucide-react'; // آیکون لبخند را از lucide-react اضافه می‌کنیم

type Props = {
  onSend: (text: string) => void;
};

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [text, setText] = useState<string>("");
  const [showPicker, setShowPicker] = useState<boolean>(false);

  // این تابع زمانی اجرا می‌شود که کاربر روی یک ایموجی کلیک کند
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText(prevText => prevText + emojiData.emoji);
    // پس از انتخاب ایموجی، می‌توان انتخابگر را بست
    // setShowPicker(false); 
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
      setShowPicker(false); // پس از ارسال، انتخابگر را ببند
    }
  };

  return (
    // از position: relative برای نگه داشتن پنل ایموجی در موقعیت صحیح استفاده می‌کنیم
    <div className="relative flex items-center gap-2">
      
      {/* دکمه برای باز کردن پنل ایموجی */}
      <button 
        onClick={() => setShowPicker(val => !val)}
        className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
      >
        <Smile size={24} />
      </button>

      {/* پنل ایموجی‌ها که به صورت شرطی نمایش داده می‌شود */}
      {showPicker && (
        <div className="absolute bottom-full mb-2 z-10">
          <Picker
            onEmojiClick={handleEmojiClick}
            height={400}
            width={350}
          />
        </div>
      )}

      {/* فیلد ورودی متن */}
      <input
        type="text"
        placeholder="پیام خود را بنویسید..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend();
          }
        }}
      />

      {/* دکمه ارسال پیام */}
      <button 
        onClick={handleSend}
        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform active:scale-95"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;