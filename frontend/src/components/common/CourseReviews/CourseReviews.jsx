import { useState, useEffect } from 'react';
import { reviewService } from '../../../services/reviewService';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './CourseReviews.css';

function StarRating({ value, onChange, readonly = false, size = 24 }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || value) ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function CourseReviews({ courseId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviews(courseId);
      const { reviews: list, avgRating: avg, totalReviews: total } = res.data.data;
      setReviews(list);
      setAvgRating(avg);
      setTotalReviews(total);

      // Nếu đã đánh giá trước đó thì load lại
      if (user) {
        const mine = list.find(r => r.student_id === user.id);
        if (mine) {
          setMyRating(mine.rating);
          setMyComment(mine.comment || '');
        }
      }
    } catch (err) {
      // silently fail
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (myRating === 0) {
      toast.warning('Vui lòng chọn số sao');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.submitReview(courseId, {
        rating: myRating,
        comment: myComment,
      });
      toast.success('Đánh giá thành công!');
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: totalReviews > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / totalReviews) * 100)
      : 0,
  }));

  return (
    <div className="course-reviews">
      <h3 className="reviews-title">Đánh giá khóa học</h3>

      {/* Summary */}
      <div className="reviews-summary">
        <div className="reviews-avg">
          <span className="reviews-avg-number">{avgRating}</span>
          <StarRating value={Math.round(avgRating)} readonly size={20} />
          <span className="reviews-avg-count">{totalReviews} đánh giá</span>
        </div>
        <div className="reviews-dist">
          {ratingDist.map(d => (
            <div className="reviews-dist-row" key={d.star}>
              <span className="dist-star">{d.star} ★</span>
              <div className="dist-bar">
                <div className="dist-bar-fill" style={{ width: `${d.pct}%` }}></div>
              </div>
              <span className="dist-count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write review button */}
      {user && (
        <button className="btn-write-review" onClick={() => setShowForm(!showForm)}>
          ✍️ {showForm ? 'Đóng' : 'Viết đánh giá'}
        </button>
      )}

      {/* Review form */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <label>Chọn số sao:</label>
          <StarRating value={myRating} onChange={setMyRating} size={32} />
          <textarea
            placeholder="Chia sẻ trải nghiệm học tập của bạn (tùy chọn)..."
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            rows={3}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      )}

      {/* Review list */}
      <div className="reviews-list">
        {reviews.length === 0 && (
          <p className="reviews-empty">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        )}
        {reviews.map((r) => (
          <div className="review-item" key={r.id}>
            <div className="review-item-header">
              <div className="review-author">
                <div className="review-avatar">
                  {r.student?.full_name?.charAt(0) || '?'}
                </div>
                <div>
                  <strong>{r.student?.full_name || 'Ẩn danh'}</strong>
                  <span className="review-date">
                    {new Date(r.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
              <StarRating value={r.rating} readonly size={16} />
            </div>
            {r.comment && <p className="review-comment">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
