import React, { useState, useMemo } from 'react';
import { Star, MapPin, Calendar, User, Filter, SortAsc } from 'lucide-react';

const ReviewsList = ({ reviews = [] }) => {
    const [selectedProperty, setSelectedProperty] = useState('all');
    const [selectedRating, setSelectedRating] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    // Get unique properties for filter
    const properties = useMemo(() => {
        const uniqueProps = [];
        const seen = new Set();
        reviews.forEach(review => {
            if (review.property && !seen.has(review.property._id)) {
                seen.add(review.property._id);
                uniqueProps.push(review.property);
            }
        });
        return uniqueProps;
    }, [reviews]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalReviews = reviews.length;
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => {
            distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        });

        return { totalReviews, avgRating, distribution };
    }, [reviews]);

    // Filter and sort reviews
    const filteredReviews = useMemo(() => {
        let filtered = [...reviews];

        // Filter by property
        if (selectedProperty !== 'all') {
            filtered = filtered.filter(r => r.property?._id === selectedProperty);
        }

        // Filter by rating
        if (selectedRating !== 'all') {
            filtered = filtered.filter(r => r.rating === parseInt(selectedRating));
        }

        // Sort
        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'highest') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'lowest') {
            filtered.sort((a, b) => a.rating - b.rating);
        }

        return filtered;
    }, [reviews, selectedProperty, selectedRating, sortBy]);

    // Render star rating
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    if (reviews.length === 0) {
        return (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Star size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Your properties haven't received any reviews yet. Encourage your tenants to leave feedback!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Statistics Panel */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 rounded-2xl text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-white/80 text-sm font-medium mb-1">Total Reviews</p>
                        <p className="text-3xl font-bold">{stats.totalReviews}</p>
                    </div>
                    <div>
                        <p className="text-white/80 text-sm font-medium mb-1">Average Rating</p>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold">{stats.avgRating}</p>
                            <Star className="fill-yellow-300 text-yellow-300" size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-white/80 text-sm font-medium mb-2">Rating Distribution</p>
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="flex items-center gap-2 text-sm">
                                    <span className="w-8">{rating}★</span>
                                    <div className="flex-1 bg-white/20 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-300 h-2 rounded-full"
                                            style={{ width: `${(stats.distribution[rating] / stats.totalReviews) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right">{stats.distribution[rating]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Sort */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-center">
                {/* Property Filter */}
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                    >
                        <option value="all">All Properties</option>
                        {properties.map(prop => (
                            <option key={prop._id} value={prop._id}>
                                {prop.title || prop.name || `${prop.type} in ${prop.location?.city}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rating Filter */}
                <div className="flex gap-2">
                    {['all', 5, 4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => setSelectedRating(rating.toString())}
                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                                selectedRating === rating.toString()
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {rating === 'all' ? 'All' : `${rating}★`}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 ml-auto">
                    <SortAsc size={18} className="text-gray-400" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Property Image */}
                                <div className="w-full md:w-48 shrink-0">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-3">
                                        <img
                                            src={review.property?.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
                                            alt={review.property?.name || 'Property'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm truncate">
                                        {review.property?.title || review.property?.name || review.property?.type}
                                    </h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin size={12} />
                                        {review.property?.location?.city}
                                    </p>
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary font-bold overflow-hidden">
                                                {review.user?.profileImage ? (
                                                    <img src={review.user.profileImage} alt={review.user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    review.user?.username?.charAt(0).toUpperCase() || <User size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900">{review.user?.username || 'Anonymous'}</h5>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>

                                    {review.comment && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                            <p className="text-gray-700">{review.comment}</p>
                                        </div>
                                    )}

                                    {/* Review Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {review.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Review ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                        <p className="text-gray-500">No reviews match your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsList;
