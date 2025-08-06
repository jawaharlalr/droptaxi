import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../utils/firebase';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const reviewData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Anonymous',
          email: data.email || '',
          rating: data.rating || null,
          message: data.review || 'No message provided.',
          createdAt: data.createdAt,
        };
      });

      setReviews(reviewData);
    } catch (error) {
      console.error('❌ Failed to fetch reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.round(rating || 0);
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < fullStars ? 'text-yellow-400' : 'text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.12 3.444a1 1 0 00.95.69h3.627c.969 0 1.371 1.24.588 1.81l-2.936 2.135a1 1 0 00-.364 1.118l1.12 3.444c.3.921-.755 1.688-1.538 1.118l-2.936-2.135a1 1 0 00-1.176 0l-2.936 2.135c-.783.57-1.838-.197-1.538-1.118l1.12-3.444a1 1 0 00-.364-1.118L2.294 8.871c-.783-.57-.38-1.81.588-1.81h3.627a1 1 0 00.95-.69l1.12-3.444z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 text-white bg-black">
      <h2 className="mb-6 text-3xl font-bold text-yellow-400">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews found.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="p-4 transition-all duration-300 bg-gray-900 border border-yellow-600 rounded hover:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-yellow-400">S.No: {index + 1}</span>
                <span className="text-xs text-gray-400">
                  {review.createdAt?.toDate?.().toLocaleString?.() || '—'}
                </span>
              </div>

              <div className="mb-1 text-sm text-gray-300">
                <span className="font-medium text-yellow-300">Name:</span> {review.name}
              </div>

              {review.email && (
                <div className="mb-1 text-sm text-gray-300">
                  <span className="font-medium text-yellow-300">Email:</span> {review.email}
                </div>
              )}

              {review.rating && (
                <div className="mb-2">
                  <span className="font-medium text-yellow-300">Rating:</span>
                  <div>{renderStars(review.rating)}</div>
                </div>
              )}

              <div className="text-yellow-200">
                <span className="font-medium text-yellow-300">Review:</span>{' '}
                <span title={review.message} className="line-clamp-3">
                  "{review.message}"
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
