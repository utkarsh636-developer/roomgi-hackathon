import React, { useState, useEffect } from 'react';
import { Star, MoreVertical, Trash2, Edit2, Image as ImageIcon, X, Send } from 'lucide-react';
import authService from '../../services/authService';
import reviewService from '../../services/reviewService';
import propertyService from '../../services/propertyService';

const ReviewSection = ({ propertyId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // Form States
    const [isEditing, setIsEditing] = useState(null); // Review ID being edited
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        fetchReviews();
    }, [propertyId]);

    const fetchReviews = async () => {
        try {
            const response = await propertyService.getPropertyReviews(propertyId);
            setReviews(response.data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 2) {
            alert("Maximum 2 images allowed");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...files]);
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        const newPreviews = [...imagePreviews];
        newPreviews.splice(index, 1);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        if (rating === 0) {
            setError("Please select a star rating to submit your review");
            setSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('rating', rating);
            formData.append('comment', comment);
            if (!isEditing) {
                formData.append('propertyId', propertyId);
            }
            images.forEach(img => {
                formData.append('images', img);
            });

            if (isEditing) {
                await reviewService.updateReview(isEditing, formData);
                setIsEditing(null);
            } else {
                await reviewService.createReview(formData);
            }

            // Reset Form
            setRating(0);
            setComment('');
            setImages([]);
            setImagePreviews([]);
            fetchReviews(); // Refresh list
        } catch (err) {
            setError(err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await reviewService.deleteReview(reviewId);
            fetchReviews();
        } catch (err) {
            alert("Failed to delete review");
        }
    };

    const startEdit = (review) => {
        setIsEditing(review._id);
        setRating(review.rating);
        setComment(review.comment);
        // Note: Existing images replacement logic is complex, for simplicity in this version we just support adding new ones replacing old
        setImages([]);
        setImagePreviews([]);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setRating(0);
        setComment('');
        setImages([]);
        setImagePreviews([]);
    };

    if (loading) return <div className="py-10 text-center">Loading reviews...</div>;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Guest Reviews <span className="text-gray-400 text-sm font-normal">({reviews.length})</span>
            </h3>

            {/* Review Form - Only for Tenants */}
            {currentUser && currentUser.role === 'tenant' && (
                <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-4">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h4>
                    {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-colors ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    >
                                        <Star size={24} className={star <= rating ? 'fill-current' : ''} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                rows="3"
                                placeholder="Share your thoughts..."
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Add Photos (Max 2)</label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer flex items-center justify-center w-12 h-12 bg-white border border-dashed border-gray-300 rounded-lg hover:border-indigo-500 text-gray-400 hover:text-indigo-500 transition-colors">
                                    <ImageIcon size={20} />
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                                </label>
                                {imagePreviews.map((src, idx) => (
                                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting ? 'Submitting...' : <><Send size={14} /> {isEditing ? 'Update Review' : 'Post Review'}</>}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                                        {review.user?.profileImage ? (
                                            <img src={review.user.profileImage} alt={review.user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            review.user?.username?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 capitalize">{review.user?.username || 'User'}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions for Owner */}
                                {currentUser && currentUser._id === review.user?._id && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => startEdit(review)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(review._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {review.comment}
                            </p>

                            {review.images && review.images.length > 0 && (
                                <div className="flex gap-2 mt-2">
                                    {review.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt="Review"
                                            onClick={() => setSelectedImage(img)}
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-100 cursor-zoom-in hover:opacity-90 transition-opacity"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 italic">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>

            {/* Image Maximize Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full View"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
