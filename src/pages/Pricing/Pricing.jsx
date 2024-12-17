import React, { useEffect, useState } from 'react';
import './pricing.css';
import HomeNav from '../../components/homeNav/HomeNav';
import Footer from '../../components/footer/Footer';

// Define the pricing plans as an array of objects
const pricingPlans = [
  {
    name: 'Basic',
    price: 15,
    duration: '/month',
    features: [
      '1 GB Storage',
      '10 GB Bandwidth',
      'Free Cancellation',
      '1 User',
      'No 24/7 Support',
      'No Lifetime Updates',
    ],
    popular: false,
  },
  {
    name: 'Standard',
    price: 30,
    duration: '/month',
    features: [
      '5 GB Storage',
      '50 GB Bandwidth',
      'Free Cancellation',
      '3 Users',
      '24/7 Support',
      'No Lifetime Updates',
    ],
    popular: false,
  },
  {
    name: 'Premium',
    price: 50,
    duration: '/month',
    features: [
      '10 GB Storage',
      '100 GB Bandwidth',
      'Free Cancellation',
      'Unlimited Users',
      '24/7 Support',
      'Lifetime Updates',
      'Priority Support',
    ],
    popular: true,
  },
  {
    name: '6-Month Plan',
    price: 150,
    duration: '/6 months',
    features: [
      '15 GB Storage',
      '150 GB Bandwidth',
      'Free Cancellation',
      '10 Users',
      '24/7 Support',
      'Lifetime Updates',
    ],
    popular: false,
  },
  {
    name: 'Annual Plan',
    price: 300,
    duration: '/year',
    features: [
      '50 GB Storage',
      '500 GB Bandwidth',
      'Free Cancellation',
      'Unlimited Users',
      'Priority 24/7 Support',
      'Lifetime Updates',
    ],
    popular: false,
  },
];

const Pricing = () => {
  const [bgColor, setBgColor] = useState('black');

  // Effect hook to handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      // Change background color based on scroll position
      if (window.scrollY > 0) {
        setBgColor('white'); // White when scrolled
      } else {
        setBgColor('black'); // Black when at the top
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ backgroundColor: bgColor, transition: 'background-color 0.3s ease' }}>
      <HomeNav />
      <div className="price pt-20">
        {/* Title and description */}
        <h1>Choose the plan that fits you, and only you.</h1>
        <p>
          Dreaming about your websites coming to life in seconds? Now they can be.
        </p>

        {/* Pricing plan container */}
        <div className="wrapper">
          {/* Map through each pricing plan */}
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`pricing-table ${plan.popular ? 'popular' : ''}`}>
              <div className="head">
                {/* Display "Popular" label if the plan is popular */}
                {plan.popular && <span>Popular</span>}
                <h4 className="title">{plan.name}</h4>
              </div>
              <div className="content">
                {/* Price Section */}
                <div className="price">
                  <h1>
                    <i className="fa-solid fa-euro-sign"></i>
                    {plan.price}$
                  </h1>
                </div>
                {/* List of features */}
                <ul>
                  {plan.features.map((feature, idx) => (
                    <li className={`${bgColor==="black"?"text-white":"text-black"} `} key={idx}>
                      <i
                        className={`fa-solid fa-circle-${feature.includes('No') ? 'xmark' : 'check'}`}
                      ></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* Purchase button */}
                <div className="buy-now">
                  <a href="#" className="btn round">Purchase Now</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Pricing;
