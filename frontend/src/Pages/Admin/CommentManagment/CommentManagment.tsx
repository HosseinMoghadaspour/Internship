import React, { useEffect, useState } from "react";
import api from "../../../types/api"; // مسیر را با توجه به پروژه خودت اصلاح کن

type Comment = {
  id: number;
  user: { username: string; img: string };
  company: { name: string };
  message: string;
  raiting: number;
  created_at: string;
};

const CommentManagment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/admin/ratings");
        console.log(res.data);
        // فرض بر این است که داده‌ها در res.data قرار دارند
        setComments(
          res.data.sort(
            (a: Comment, b: Comment) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
      } catch (err) {
        setError(`خطا در دریافت کامنت‌ها ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/comments/${id}/approve`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("خطا در تایید کامنت");
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-xl font-bold mb-6 text-indigo-700 text-right">
        کامنت‌های تایید نشده
      </h2>
      {comments.length === 0 ? (
        <div className="text-gray-500 text-center">
          کامنت تایید نشده‌ای وجود ندارد.
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between border-r-4 border-indigo-400"
            >
              <div className="flex justify-between items-center gap-5">
                {comment.user.img ? (
                  <img
                    src={`http://localhost:8000/storage/${comment.user.img}`}
                    alt={comment.user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow">
                    {comment.user.username[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-indigo-700">
                  {comment.user.username}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleString("fa-IR")}
                </span>
              </div>
              <div className="mt-3 text-gray-700">{comment.message}</div>
              <div className="mt-3 text-gray-500">
                شرکت: {comment.company.name}
              </div>
              <div className="flex justify-end mt-2 gap-3">
                <button
                  onClick={() => handleApprove(comment.id)}
                  className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  تایید
                </button>
                <button
                  onClick={() => handleApprove(comment.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-green-600 transition"
                >
                  رد
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentManagment;
