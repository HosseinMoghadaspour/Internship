import axios from 'axios';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';


export const fetchGeminiApiKey = async (): Promise<string | null> => {
  try {
    const response = await axios.get('http://localhost:8000/api/getGeminiKey');
    return response.data?.apiKey ?? null;
  } catch (error) {
    console.error('❌ Failed to fetch API key:', error);
    return null;
  }
};

export const askAI = async (question: string): Promise<string> => {
  const refusalMessage =
    'متاسفانه من فقط در زمینه برنامه نویسی و شرکت‌های کارآموزی می‌توانم به شما کمک کنم.';

  const metaPrompt = `
    You are a specialized assistant. Your designated role is to answer questions that are strictly about "programming" (برنامه نویسی) or "internship companies" (شرکت های کارآموزی).

    If the user's question pertains to either of these topics, provide a helpful and direct answer.

    However, if the user's question is NOT about these specified topics, you MUST ignore the user's question and reply with the following exact Persian sentence and nothing else: "${refusalMessage}"

    Here is the user's question: "${question}"

    همیشه اول جوابت از - استفاده کن
  `;

  try {
    const apiKey = await fetchGeminiApiKey();

    if (!apiKey) {
      return 'کلید API دریافت نشد.';
    }

    const response = await axios.post(
      `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: metaPrompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? text.trim() : 'جوابی دریافت نشد.';

  } catch (error: any) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    return 'خطایی رخ داد هنگام اتصال به هوش مصنوعی.';
  }
};
