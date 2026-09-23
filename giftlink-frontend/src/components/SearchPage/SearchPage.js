import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [ageLimit, setAgeLimit] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchProducts = async (filters = {}) => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();

            if (filters.name) params.append('name', filters.name);
            if (filters.category) params.append('category', filters.category);
            if (filters.condition) params.append('condition', filters.condition);
            if (filters.age_years) params.append('age_years', String(filters.age_years));

            const queryString = params.toString();
            const url = queryString
                ? `${urlConfig.backendUrl}/api/search?${queryString}`
                : `${urlConfig.backendUrl}/api/gifts`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (err) {
            setError(err.message || 'Unable to load products.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = () => {
        fetchProducts({
            name: searchText,
            category: selectedCategory,
            condition: selectedCondition,
            age_years: ageLimit,
        });
    };

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column gap-3">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Condition</label>
                                    <select
                                        className="form-select"
                                        value={selectedCondition}
                                        onChange={(e) => setSelectedCondition(e.target.value)}
                                    >
                                        <option value="">All Conditions</option>
                                        {conditions.map((condition) => (
                                            <option key={condition} value={condition}>{condition}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Max Age: {ageLimit} years</label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="1"
                                    max="20"
                                    value={ageLimit}
                                    onChange={(e) => setAgeLimit(Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label className="form-label">Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search for a gift name"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>

                            <button className="btn btn-primary" onClick={handleSearch}>
                                Search Gifts
                            </button>
                        </div>
                    </div>

                    {loading && <p>Loading gifts...</p>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {!loading && !error && searchResults.length === 0 && (
                        <div className="alert alert-info">No gifts match your current filters.</div>
                    )}

                    {!loading && searchResults.length > 0 && (
                        <div className="row">
                            {searchResults.map((gift) => (
                                <div className="col-md-6 mb-3" key={gift._id || gift.id}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">{gift.name}</h5>
                                            <p className="card-text">Category: {gift.category}</p>
                                            <p className="card-text">Condition: {gift.condition}</p>
                                            <p className="card-text">Age: {gift.age_years || gift.age || 'N/A'}</p>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => goToDetailsPage(gift.id)}
                                            >
                                                View Details
                                            </button>
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
}

export default SearchPage;
