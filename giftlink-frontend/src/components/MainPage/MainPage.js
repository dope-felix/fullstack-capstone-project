import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import GiftImage from '../GiftImage';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                const response = await fetch (url);
                if (!response.ok) {
                    // something went wrong 
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchGifts();

    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);

      };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric'});
      };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <main className="container mt-4">
            <div className="product-grid-header">
                <div>
                    <p className="eyebrow">GIFT DISCOVERY</p>
                    <h1 className="page-title">Find something useful.</h1>
                    <p className="page-subtitle">Browse practical gifts shared by the GiftLink community.</p>
                </div>
                <span className="inventory-count">{gifts.length} items available</span>
            </div>
            <div className="row">
                {gifts.map((gift, index) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            {/* // Task 4: Display gift image or placeholder */}
                                                        
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <GiftImage
                                        src={gift.image}
                                        alt={gift.name}
                                        className="card-img-top"
                                        sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 33vw, 360px"
                                        loading={index < 3 ? 'eager' : 'lazy'}
                                    />
                                ) : (
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>


                            <div className="card-body">

                                {/* // Task 5: Display gift image or placeholder */}
                                <h5 className="card-title">{gift.name}</h5>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                {/* // Task 6: Display gift image or placeholder */}
                                <p className="card-text">{formatDate(gift.date_added)}</p>
                                

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default MainPage;
