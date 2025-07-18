import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import TempButton from "../../../components/Button";
import { CgSpinner } from "react-icons/cg"; // Import a spinner icon

type Company = {
  id: number;
  name: string;
  province: string;
  city: string;
  address: string;
  description: string | null;
  images: { id: number; image_path: string }[];
  introduced_by: {
    username: string;
  };
  average_rating?: number;
};

type CommentUser = {
  username: string;
};

type Comment = {
  id: number;
  message: string;
  created_at: string;
  user: CommentUser | null;
  rating?: number;
  likes?: number;
  dislikes?: number;
  user_reaction?: "like" | "dislike" | null;
  isReacting?: boolean; // NEW: Add isReacting state to Comment type
};
type User = {
  id: number;
  username: string;
  img: string | null;
  is_admin: boolean;
};

const CompanyDetailsPageSkeleton: React.FC = () => (
  <div className=" animate-pulse max-w-7xl mx-auto p-4 md:p-8">
    <div className="text-center mb-10 lg:mb-16">
      <div className="h-10 bg-gray-300 rounded-md w-3/5 sm:w-1/2 mx-auto mb-4"></div>
      <div className="h-3 bg-gray-300 rounded-md w-32 md:w-48 mx-auto"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
      <div className="md:col-span-2 flex flex-col items-center md:items-stretch">
        <div className="w-full aspect-square md:aspect-[4/3] rounded-lg bg-gray-300 mb-6"></div>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 p-3 bg-gray-200 rounded-md">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-gray-300"
            ></div>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200">
        <div className="h-8 bg-gray-300 rounded-md w-1/3 mb-6 pb-4 border-b border-gray-200"></div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="py-1">
              <div className="h-5 bg-gray-300 rounded-md w-1/4 mb-2"></div>
              <div className="h-5 bg-gray-300 rounded-md w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-12 lg:mt-16 pt-8 border-t border-gray-200">
      <div className="h-8 bg-gray-300 rounded-md w-2/5 sm:w-1/3 mb-8"></div>
      <div className="mb-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="w-full h-24 bg-gray-200 rounded-md mb-3"></div>
        <div className="h-10 bg-gray-300 rounded-md w-28"></div>
      </div>
      <div className="space-y-6">
        {[...Array(2)].map((_, index) => (
          <CommentSkeletonCard key={index} />
        ))}
      </div>
    </div>
  </div>
);

const CommentSkeletonCard: React.FC = () => (
  <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 animate-pulse">
    <div className="flex items-start sm:items-center mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>
      <div className="flex-grow mt-1">
        <div className="h-4 bg-gray-300 rounded-md w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded-md w-1/4"></div>
      </div>
    </div>
    <div className="space-y-2.5 mt-2">
      <div className="h-4 bg-gray-300 rounded-md w-full"></div>
      <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
    </div>
  </div>
);

interface StarRatingProps {
  count?: number;
  value: number;
  size?: number;
  isReadOnly?: boolean;
  onChange?: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  value,
  size = 24,
  isReadOnly = false,
  onChange,
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const stars = Array.from({ length: count }, (_, i) => i + 1);

  const handleClick = (val: number) => {
    if (!isReadOnly && onChange) {
      onChange(val);
    }
  };

  const handleMouseOver = (val: number) => {
    if (!isReadOnly) {
      setHoverValue(val);
    }
  };

  const handleMouseLeave = () => {
    if (!isReadOnly) {
      setHoverValue(undefined);
    }
  };

  const getColor = (starValue: number) => {
    const displayValue = hoverValue ?? value;
    if (displayValue >= starValue) {
      return "url(#star-gradient)"; // استفاده از گرادینت
    }
    return "rgba(200, 200, 200, 0.8)"; // رنگ ستاره خالی
  };

  return (
    <div className="flex items-center" dir="ltr">
      {/* تعریف گرادینت برای ستاره‌ها */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
      </svg>
      {stars.map((starValue) => (
        <FaStar
          key={starValue}
          size={size}
          onClick={() => handleClick(starValue)}
          onMouseOver={() => handleMouseOver(starValue)}
          onMouseLeave={handleMouseLeave}
          fill={getColor(starValue)}
          style={{
            cursor: isReadOnly ? "default" : "pointer",
            transition: "transform 0.2s ease-in-out, filter 0.2s",
            filter: `drop-shadow(0 1px 2px rgba(0,0,0,0.2))`,
            transform:
              !isReadOnly && (hoverValue ?? value) >= starValue
                ? "scale(1.15)"
                : "scale(1)",
          }}
        />
      ))}
    </div>
  );
};

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/company/${id}`
      );
      setCompany(response.data);
      if (response.data.images && response.data.images.length > 0) {
        setCoverImage(response.data.images[0].image_path);
      } else {
        setCoverImage(null);
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات شرکت:", error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;

    setCommentsLoading(true);
    try {
      const commentsResponse = await axios.get(
        `http://localhost:8000/api/company/${id}/comments`
      );
      const fetchedComments: Comment[] = commentsResponse.data;

      if (user?.id) {
        const commentsWithReactions = await Promise.all(
          fetchedComments.map(async (comment) => {
            try {
              const reactionResponse = await axios.get(
                `http://localhost:8000/api/comments/${comment.id}/reactions/${user.id}`
              );
              return {
                ...comment,
                likes: reactionResponse.data.likes,
                dislikes: reactionResponse.data.dislikes,
                user_reaction: reactionResponse.data.user_reaction,
              };
            } catch (error) {
              console.error(
                `خطا در دریافت واکنش‌های نظر ${comment.id}:`,
                error
              );
              return { ...comment, likes: 0, dislikes: 0, user_reaction: null };
            }
          })
        );
        setComments(commentsWithReactions);
      } else {
        const commentsForGuest = fetchedComments.map((c) => ({
          ...c,
          likes: c.likes ?? 0,
          dislikes: c.dislikes ?? 0,
          user_reaction: null,
        }));
        setComments(commentsForGuest);
      }
      setCommentError(null);
    } catch (error) {
      console.error("خطا در دریافت نظرات:", error);
      setCommentError("بارگذاری نظرات با مشکل مواجه شد.");
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [id, user]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setSubmitError("برای ارسال نظر باید وارد حساب کاربری شوید.");
      return;
    }

    if (!newComment.trim() || newRating === 0) {
      setSubmitError("لطفا امتیاز و متن نظر را وارد کنید.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await axios.post("http://localhost:8000/api/RatingAndComments", {
        user_id: user.id,
        company_id: id,
        message: newComment,
        rating: newRating,
      });

      setNewComment("");
      setNewRating(0);
      setSubmitSuccess("نظر شما با موفقیت ثبت شد.");

      await fetchComments();
      await fetchCompany();
    } catch (error) {
      console.error("خطا در ارسال نظر:", error);
      setSubmitError("خطا در ارسال نظر. لطفا دوباره تلاش کنید.");
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("خطا در پارس کردن اطلاعات کاربر:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchCompany();
      fetchComments();
    }
  }, [id, user, fetchCompany, fetchComments]); // fetchComments is dependent on 'user', so it will re-run correctly on login/logout.

  const handleChat = () => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    navigate(`/chat/${company?.introduced_by.username}`);
  };
  const handleDeleteReaction = async (commentId: number, user_id: number) => {
    try {
      await axios.post("http://localhost:8000/api/deleteReaction", {
        user_id: user_id,
        rating_id: commentId,
      });
      return;
    } catch (err) {
      return err;
    }
  };

  const handleReaction = async (commentId: number, isLike: boolean) => {
    if (!user) {
      return;
    }

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, isReacting: true } : comment
      )
    );

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          let newLikes = comment.likes ?? 0;
          let newDislikes = comment.dislikes ?? 0;
          let newUserReaction = comment.user_reaction;

          if (isLike) {
            if (comment.user_reaction === "like") {
              handleDeleteReaction(commentId, user.id);
              newLikes = Math.max(0, newLikes - 1);
              newUserReaction = null;
            } else {
              newLikes++;
              if (comment.user_reaction === "dislike") {
                newDislikes = Math.max(0, newDislikes - 1);
              }
              newUserReaction = "like";
            }
          } else {
            if (comment.user_reaction === "dislike") {
              handleDeleteReaction(commentId, user.id);
              newDislikes = Math.max(0, newDislikes - 1);
              newUserReaction = null;
            } else {
              newDislikes++;
              if (comment.user_reaction === "like") {
                newLikes = Math.max(0, newLikes - 1);
              }
              newUserReaction = "dislike";
            }
          }

          return {
            ...comment,
            likes: newLikes,
            dislikes: newDislikes,
            user_reaction: newUserReaction,
          };
        }
        return comment;
      })
    );

    try {
      await axios.post("http://localhost:8000/api/commentReaction", {
        user_id: user.id,
        rating_id: commentId,
        is_like: isLike,
      });
    } catch (error) {
      console.error("Error submitting reaction:", error);
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === commentId) {
            fetchComments();
            return { ...comment, isReacting: false };
          }
          return comment;
        })
      );
    } finally {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, isReacting: false } : comment
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-white min-h-screen">
        <Navbar />
        <CompanyDetailsPageSkeleton />
      </div>
    );
  }
  if (!company) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height,80px))] p-5">
          <svg
            className="h-16 w-16 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-2xl text-gray-700 mb-6">شرکت پیدا نشد.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-blue-100 via-indigo-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Title Section */}
        <div className="text-center mb-10 lg:mb-16">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-indigo-700 inline-block">
            {company.name}
          </h1>
          <hr className="mt-4 w-32 md:w-48 mx-auto border-t-4 border-indigo-500 rounded" />
        </div>

        {/* Company Info Grid - [بدون تغییر] */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-2 flex flex-col items-center md:items-stretch">
            {coverImage ? (
              <div className="w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-xl mb-6 border-2 border-indigo-200 bg-white">
                <img
                  src={`http://localhost:8000/storage/${coverImage}`}
                  alt={`${company.name} cover image`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
              </div>
            ) : (
              <div className="w-full aspect-square md:aspect-[4/3] rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 shadow-lg mb-6 border border-gray-300">
                <p className="text-lg">تصویری موجود نیست</p>
              </div>
            )}
            {company.images && company.images.length > 1 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-3 p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200">
                {company.images.map((img) => (
                  <div
                    key={img.id}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:opacity-80
                        ${
                          coverImage === img.image_path
                            ? "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-50"
                            : "border-gray-300 hover:border-indigo-400"
                        }`}
                    onClick={() => setCoverImage(img.image_path)}
                  >
                    <img
                      src={`http://localhost:8000/storage/${img.image_path}`}
                      alt={`${company.name} thumbnail ${img.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Company Details */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
              اطلاعات شرکت
            </h2>
            <dl className="divide-y divide-gray-100">
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  امتیاز
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.average_rating !== undefined && (
                    <div className="flex items-center gap-2">
                      <StarRating
                        value={company.average_rating}
                        isReadOnly={true}
                        size={20}
                      />
                      <span className="text-md font-bold text-gray-700">
                        ({company.average_rating.toFixed(1)})
                      </span>
                    </div>
                  )}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  استان
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.province || <span className="text-gray-400">—</span>}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  شهر
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.city || <span className="text-gray-400">—</span>}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  آدرس
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  {company.address || <span className="text-gray-400">—</span>}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  توضیحات
                </dt>
                <dd className="mt-1 text-md leading-7 text-gray-800 sm:col-span-2 sm:mt-0 whitespace-pre-line">
                  {company.description || (
                    <span className="text-gray-400">—</span>
                  )}
                </dd>
              </div>
              <div className="px-1 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-md font-medium leading-6 text-indigo-700">
                  ثبت شده توسط
                </dt>
                <dd className="flex justify-between mt-1 text-md leading-6 text-gray-800 sm:col-span-2 sm:mt-0">
                  <div>
                    {company.introduced_by?.username || (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>

                  <button className="bg-blue-500 hover:bg-blue-600 text-white w-[120px] h-[40px] rounded-md" onClick={handleChat}>
                    پیغام دادن
                  </button>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 lg:mt-16 pt-8 border-t border-gray-300">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-8">
            نظرات کاربران
          </h2>

          {/* Submit Comment Form */}
          <div className="mb-10 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
            {user ? (
              <>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  نظر خود را ثبت کنید
                </h3>
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-5">
                    <label className="block text-md font-medium text-gray-700 mb-2">
                      امتیاز شما:
                    </label>
                    <StarRating
                      value={newRating}
                      onChange={setNewRating}
                      size={30}
                    />
                  </div>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-base"
                    rows={4}
                    placeholder="نظر شما..."
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      setSubmitError(null);
                      setSubmitSuccess(null);
                    }}
                    required
                    disabled={submitLoading}
                  />
                  {submitError && (
                    <p className="text-red-600 text-sm mt-2">{submitError}</p>
                  )}
                  {submitSuccess && (
                    <p className="text-green-600 text-sm mt-2">
                      {submitSuccess}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "در حال ارسال..." : "ارسال نظر"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <p className="text-gray-700 font-medium">
                  برای ثبت نظر، لطفا{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    وارد شوید
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>

          {/* Display Comments List */}
          {commentsLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <CommentSkeletonCard key={index} />
              ))}
            </div>
          ) : commentError ? (
            <p className="text-red-600 p-4 bg-red-50 rounded-md text-center">
              {commentError}
            </p>
          ) : comments.length === 0 ? (
            <p className="text-gray-600 p-6 bg-white rounded-md shadow-lg text-center">
              هنوز نظری برای این شرکت ثبت نشده است. اولین نفر باشید!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 sm:p-5 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-indigo-100 transition-shadow duration-300 flex items-start"
                >
                  <div className="flex-shrink-0 mr-3 sm:mr-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg sm:text-xl font-semibold shadow-md">
                      {comment.user?.username
                        ? comment.user.username[0].toUpperCase()
                        : "؟"}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-800 text-sm sm:text-md mr-5">
                          {comment.user?.username || "کاربر ناشناس"}
                        </span>
                        {comment.rating !== undefined && (
                          <StarRating
                            value={comment.rating}
                            isReadOnly={true}
                            size={16}
                          />
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed mt-1.5 text-sm sm:text-base whitespace-pre-line mr-5">
                        {comment.message}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-0">
                        {new Date(comment.created_at).toLocaleDateString(
                          "fa-IR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-4 sm:gap-x-5 mt-3.5 pt-3 border-t border-gray-200">
                      {comment.isReacting ? (
                        <div className="flex items-center text-gray-500">
                          <CgSpinner className="animate-spin mr-2 h-5 w-5" /> در
                          حال پردازش...
                        </div>
                      ) : (
                        <>
                          <button
                            className={`flex items-center text-xs sm:text-sm focus:outline-none transition-colors duration-150 group 
                            ${
                              comment.user_reaction === "like"
                                ? "text-green-600"
                                : "text-gray-500 hover:text-indigo-600"
                            }`}
                            onClick={() => handleReaction(comment.id, true)}
                            disabled={comment.isReacting} // Disable during reaction
                          >
                            {comment.user_reaction === "like" ? (
                              <AiFillLike className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            ) : (
                              <AiOutlineLike className="mr-1 h-4 w-4 sm:h-5 sm:w-5 group-hover:text-indigo-500 transition-colors" />
                            )}
                            <span>لایک</span>
                            <span className="mr-1">({comment.likes ?? 0})</span>
                          </button>
                          <button
                            className={`flex items-center text-xs sm:text-sm focus:outline-none transition-colors duration-150 group
                            ${
                              comment.user_reaction === "dislike"
                                ? "text-red-600"
                                : "text-gray-500 hover:text-red-600"
                            }`}
                            onClick={() => handleReaction(comment.id, false)}
                            disabled={comment.isReacting} // Disable during reaction
                          >
                            {comment.user_reaction === "dislike" ? (
                              <AiFillDislike className="mr-1 h-4 w-4 sm:h-5 sm:w-5 text-red-600 transition-colors" />
                            ) : (
                              <AiOutlineDislike className="mr-1 h-4 w-4 sm:h-5 sm:w-5 group-hover:text-red-500 transition-colors" />
                            )}
                            <span>دیسلایک</span>
                            <span className="mr-1">
                              ({comment.dislikes ?? 0})
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
