import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { HiShoppingCart } from 'react-icons/hi';
import { IoArrowRedoCircle } from 'react-icons/io5';
import { BsStarFill } from 'react-icons/bs';
import { BiUserCircle } from 'react-icons/bi';


const ProductDetail = () => {

  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [starCounts, setStarCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });

  const getFormattedDeliveryDate = (date) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
  
    return `${dayOfWeek}, ${month} - ${dayOfMonth}`;
  };
  
  const [deliveryDate, setDeliveryDate] = useState('');
  //const [ratingCounts, setRatingCounts] = useState({});
  

  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get('productId');
  console.log(" hei : ",productId)

  const [isSaved, setIsSaved] = useState(false);
  const [isCart, setIsCart] = useState(false);

  const handleButtonClick = async () => {
    const authid = localStorage.getItem('authid');
    if (!authid) {
      navigate('/login');
    } else {
      try {
        if (isSaved) {
          await axios.delete(`http://localhost:8000/api/wishlist/delete/${authid}/${productId}`);
          setIsSaved(false);
        } else {
          await axios.post('http://localhost:8000/api/wishlist/add', { userid: authid, productid: productId });
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error updating wishlist:', error);
      }
    }
  };

  const handleCartClick = async  () => {
    const authid = localStorage.getItem('authid');
    if (!authid) {
      navigate('/login');
    } else {
      try {
            await axios.post('http://localhost:8000/api/cart/carts', { userid: authid, productid: productId });
            setIsCart(true);
        
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(' hi ')
        const res = await axios.post(`http://localhost:8000/api/products/display/${productId}`);
        console.log(' product : ',res)
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const authid = localStorage.getItem('authid');
    if (authid) {
      const fetchWishlistStatus = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/wishlist/wishlist/${authid}/${productId}`);
          setIsSaved(res.data.exists);
        } catch (error) {
          console.error('Error fetching wishlist status:', error);
        }
      };

      fetchWishlistStatus();
    }
  }, [productId]);

 useEffect(() => {
    const authid = localStorage.getItem('authid');
    if (authid) {
      const fetchcartStatus = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/cart/cart/${authid}/${productId}`);
          setIsCart(res.data.exists);
        } catch (error) {
          console.error('Error fetching cart status:', error);
        }
      };

      fetchcartStatus();
    }
  }, [productId]);

  const handleShare = async (pId,pName) => {
    try {
      await navigator.share({
        title: pName,
        url: `http://localhost:3000/ProductDetail?productId==${pId}`,
      });
      console.log('Shared successfully');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const [comment, setComment] = useState('');

  const handleSubmitComment = async () => {
    try {
      if (comment.trim() === '') {
        return;
      }
  
      const response = await axios.post('', {
        comment: comment,
      });
  
      if (response.status === 201) {
        console.log('Comment saved to the database');
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const rateProduct = () => {
    console.log('id: ',product._id)
    navigate(`/review?productId=${product._id}`);
  };

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/review/averagerating/${productId}`);
        if (response.data) {
          setAverageRating(response.data.averageRating);
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
      }
    };

    fetchAverageRating();
  }, [productId]);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/review/usercount/${productId}`);
        if (response.data) {
          setUserCount(response.data.userCount);
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/review/reviewproduct/${productId}`);
        if (response.data) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

 /*useEffect(() => {
    const fetchRatingCounts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/review/ratingcount/${productId}`);
        console.log('Rating Counts Response:', response.data);
        setRatingCounts(response.data);
      } catch (error) {
        console.error('Error fetching rating counts:', error);
      }
    };

    fetchRatingCounts();
  }, [productId]);*/

  useEffect(() => {
    async function fetchStarCounts() {
      try {
        console.log("product is  : ",productId)
        const res = await axios.get(`http://localhost:8000/api/review/eachstar/${productId}`);
        console.log("rating : ",res)
        setStarCounts(res.data);
      } catch (error) {
        console.error('Error fetching star counts:', error);
      }
    }

    fetchStarCounts();
  }, [productId]);

  useEffect(() => {
    // Calculate delivery date
    const today = new Date();
    const deliveryDays = 2; // You can adjust this value as needed
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    // Format the delivery date
    const formattedDeliveryDate = getFormattedDeliveryDate(deliveryDate);

    setDeliveryDate(formattedDeliveryDate);
  }, []);


  return (
    <div>
      <div>
<meta charSet="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>New2U</title>
<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" />
<link rel="stylesheet" href="style.css" />
<div className="main-navbar shadow-sm sticky-top">
  <div className="top-navbar">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 my-auto d-none d-sm-none d-md-block d-lg-block">
          <div className="gradient-text">
          <a className="nav-link" href="/">
          <h5 className="brand-name">New2U</h5>
          </a>
          </div>
        </div>
        <div className="col-md-5 my-auto">
          <form role="search">
            <div className="input-group">
              <input type="search" placeholder="Search your product" className="form-control" />
              <span className="search-button">
              <button className="search-button1" type="submit">
                <i className="fa fa-search" />
              </button>
              </span>
            </div>
          </form>
        </div>
        
        <div className="col-md-5 my-auto">
          <ul className="nav justify-content-end">
            
            <li className="nav-item">
            <div className="gradient-text">
              <a className="nav-link" href="#">
                <i className="fa fa-shopping-cart" /> Cart
              </a>
            </div>
            </li>
            <li className="nav-item">
            <div className="gradient-text">
              <a className="nav-link" href="#">
                <i className="fa fa-heart" /> Wishlist
              </a>
            </div>
            </li>
            <li className="nav-item">
            <div className="gradient-text">
              <a className="nav-link" href="/login">
                <i className="fa fa-user" /> Login
              </a>
            </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
  <div>
    <div className='productdiv1'>
    <div className='productdiv8'>
      <div className='productbook'>
        <h2>{product.productName}</h2>
      </div>
      <div className='prosub'>
      <div className='rating'> 
      <h2 style={{backgroundColor:'green' ,color:'white',marginLeft:'5px', width:'50px',textAlign:'center',paddingTop:'2px',  height:'30px', fontWeight:'bold', fontSize:'larger', borderRadius:'10px'}}>{averageRating} ★ </h2>
      </div>
        <div className='sharecartwishlist' style={{textAlign:'right'}}>

          <a className='share-button' onClick={()=> {handleShare(product._id, product.productName)}}>
          <IoArrowRedoCircle style={{ marginRight: '5px', fontSize: '26px' }}/>
          Share
          </a> 

          <button className="cart-button" onClick={handleCartClick} style={{ color: isCart ? 'blue' : 'black', fontSize: isCart ? '22px' : '22px' }}>
              <span className='cart-el'><HiShoppingCart />
                <span className="cartbutton-text">Cart</span>
              </span>
            </button>

          <button className={`wishlist-button ${isSaved ? 'saved' : ''}`}  >
            <span  className='wishlist-el' >  <FontAwesomeIcon icon={faHeart} style={{fontSize: "18"}}onClick={handleButtonClick} />
            <span className="wishlistbutton-text" onClick={handleButtonClick}>{isSaved ? 'Saved' : 'Save'}</span></span>  
          </button>
        </div>
      </div>
      </div>
      <div className='productdiv2' >
        <div className='product-div-image'>
            <img className="product-img1" src={`http://localhost:8000/${product.image}`} alt="Product" style={{ height: "500px" }} />
        </div>
        <div className='productdiv3'>
            <div className='productdiv4'>
              <img className="product-img2" src={`http://localhost:8000/${product.image}`} alt="Product" style={{ height: "245px" }} />
              <img className="product-img3" src={`http://localhost:8000/${product.image}`} alt="Product" style={{ height: "245px" }} />
            </div>
            <div className='productdiv5'>
              <img className="product-img4" src={`http://localhost:8000/${product.image}`} alt="Product" style={{ height: "245px"}} />
              <img className="product-img5" src={`http://localhost:8000/${product.image}`} alt="Product" style={{ height: "245px" }} />
            </div>
          </div>
        </div>
        <div className="product-detail">
          <h1 className='price' style={{paddingLeft:'20px'}}> ₹ {product.price}</h1>
          {deliveryDate && (
        <p style={{fontWeight:'bold', fontFamily:"inherit"}}>Get it by: 2 days ( {deliveryDate} )</p>
      )}
      
          <h1 className='prh1' style={{ textAlign:'left', paddingLeft:'20px'}}>Description </h1>
          <div className='testdiv'>
            <div className='descri' style={{marginLeft:'140px'}}>
            {product.description?.split(',').map((i)=> (
              <div>
                <p>. {i}</p>
              </div>
              ))}
            </div>
            <div>
              <div>
                <button onClick={rateProduct}>Rate Product</button>
                <h1 style={{ textAlign:'left', paddingLeft:'20px'}}>Ratings & Reviews</h1>
                <div style={{/*backgroundColor:'cyan',*/ display:'flex', width:'60%', marginLeft:'150px'}}>
                    <div style={{flexBasis:'30%', backgroundColor:'GrayText'}}>
                      <h1 style={{ textAlign:'left', paddingTop:'25px', borderRadius:'10px'}}>{averageRating} <BsStarFill style={{color:'green'}} /> </h1>
                      <p style={{textAlign:'left'}}>Average Rating</p>
                    </div>
                    <div style={{flexBasis:'50%'}}>                     
                      {[1, 2, 3, 4, 5].map((row) => (
                      <div key={row}>
                          {[1, 2, 3, 4, 5].map((col) => (
                          <span key={col} className={col <= 6 - row ? 'gold-star' : 'white-star'}>
                            <BsStarFill/> <span> </span>
                          </span>
                          ))}
                          <br />
                        </div>
                      ))}
                    </div>
                    <div style={{flexBasis:'20%'}}>
                    {/*Object.keys(ratingCounts).map(rating => (
        <p key={rating}>
                    {rating} Star: {ratingCounts[rating]}
        </p>
                    ))*/}

<ul>
{Object.keys(starCounts)
  .sort((a, b) => b - a) // Sort keys in descending order
  .map(star => (
    <ol key={star} style={{marginLeft:'-120px', textAlign:'left'}}>
       {starCounts[star]}
    </ol>
  ))}
      </ul>

                    </div>
                  </div>
              </div>
              <div style={{borderTop:'1px solid '}}>
              <div style={{marginLeft:'180px',marginTop:'50px', backgroundColor:'yellowgreen', textAlign:'left', borderBottom:'1px solid'}}>
              {reviews.map((review) => (
      <div key={review._id} >
      <div style={{display:'flex', marginTop:'50px'}}>
        <div>
          <BiUserCircle size={60} style={{paddingTop:'5px', fontWeight:'lighter'}}/>
        </div>
        <div>
          <p style={{fontSize:'25px', paddingLeft:'5px'}}> {review.user}</p>
          <p style={{marginTop:'-10px', paddingLeft:'5px', fontSize:'20px'}}>
          {review.rating}★
          </p>
      </div>
      </div>
    
    <p style={{fontWeight:'bold', paddingLeft:'100px', paddingTop:'10px'}}> {review.comment}</p> 
    </div>
  ))}

    </div>
    
    </div>
          </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductDetail;
