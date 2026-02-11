import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [typingText, setTypingText] = useState("");
  const words = ["Weightlifting", "Bodybuilding", "Powerlifting"];
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const timer = setTimeout(() => {
      if (isDeleting) {
        setTypingText(currentWord.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else {
        setTypingText(currentWord.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }

      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      }
    }, isDeleting ? 100 : 200);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className="pro-theme min-h-screen bg-[#0a0a0a]">
      {/* Header / Nav */}
      <header>
        <nav className="flex justify-around items-center p-5 bg-[#0a0a0a]/90 sticky top-0 z-[1000] border-b border-white/10">
          <div className="logo text-3xl font-bold font-['Bebas_Neue'] tracking-[2px] text-white">
            Wellnest <span className="text-[#4ade80]">Smart Health</span>
          </div>
          <ul className="hidden md:flex list-none gap-8">
            <li><a href="#" className="text-white no-underline hover:text-[#4ade80] transition-all">Home</a></li>
            <li><a href="#services" className="text-white no-underline hover:text-[#4ade80] transition-all">Services</a></li>
            <li><a href="#about" className="text-white no-underline hover:text-[#4ade80] transition-all">About Us</a></li>
            <li><a href="#pricing" className="text-white no-underline hover:text-[#4ade80] transition-all">Pricing</a></li>
            <li><a href="#review" className="text-white no-underline hover:text-[#4ade80] transition-all">Review</a></li>
          </ul>
          <Link to="/register" className="join-btn-outline no-underline px-5 py-2 border-2 border-[#4ade80] rounded hover:bg-[#4ade80] hover:text-black transition-all">
            Join Us
          </Link>
        </nav>
      </header>
      {/* Hero Section */}
      <section className="hero flex flex-col md:flex-row items-center justify-center p-[50px_10%] md:h-[85vh] gap-12">
        <div className="hero-content flex-1 max-w-2xl text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-['Bebas_Neue'] tracking-[2px] text-white mb-4">
            Build Your <br /> Dream Physique
          </h1>
          <h2 className="highlight text-[#4ade80] text-3xl md:text-4xl mb-6 font-['Bebas_Neue']">
            <span>{typingText}</span><span className="cursor">|</span>
          </h2>
          <p className="text-[#ccc] text-lg leading-relaxed mb-8">
            Connect with world-class trainers and track your nutrition, sleep, and mood with precision.
            WellNest is your all-in-one ecosystem for elite performance.
          </p>
          <Link to="/register" className="join-btn-fill no-underline bg-[#4ade80] text-black font-bold px-8 py-3 rounded hover:scale-105 transition-all inline-block">
            Join Us
          </Link>
        </div>
        <div className="hero-image flex-1 text-center md:text-right">
          <img src="/src/assets/gym-man.jpg" alt="Fitness Model" className="w-full max-w-[500px] inline-block" />
        </div>
      </section>

     {/* Services */}
<section className="services-section p-[80px_10%] text-center" id="services">
  <h2 className="text-5xl font-['Bebas_Neue'] tracking-[2px] text-white mb-12">
    Our <span className="text-[#4ade80]">Services</span>
  </h2>
  
  {/* Tailwind grid classes-ah thookitu namma CSS flex-ah use pannum */}
  <div className="grid"> 
    {/* Card 1 */}
    <motion.div whileHover={{ y: -10 }} className="service-card">
      <img src="/src/assets/physical.jpg" alt="Physical Fitness" />
      <h3>Physical Fitness</h3>
    </motion.div>

    {/* Card 2 */}
    <motion.div whileHover={{ y: -10 }} className="service-card">
      <img src="/src/assets/weight-gain.jpg" alt="Weight Gain" />
      <h3>Weight Gain</h3>
    </motion.div>

    {/* Card 3 */}
    <motion.div whileHover={{ y: -10 }} className="service-card">
      <img src="/src/assets/strength.jpg" alt="Strength Training" />
      <h3>Strength Training</h3>
    </motion.div>
  </div>
</section>
      {/* About Us / Why Choose Us */}
<section className="about-us-section p-[100px_10%] bg-[#0a0a0a]" id="about">
  <div className="about-container">
    
    {/* Left Side: Image */}
    <div className="about-image-wrapper">
      <img src="/src/assets/treadmill-man.jpg" alt="About Us" className="about-img" />
    </div>

    {/* Right Side: Content */}
    <div className="about-content">
      <h2 className="text-5xl font-['Bebas_Neue'] tracking-[2px] text-white mb-6">
        Why <span className="text-[#4ade80]">Choose Us?</span>
      </h2>
      <p className="text-[#ccc] text-lg leading-relaxed mb-8">
        Our diverse membership base creates a friendly and supportive atmosphere, where you can make friends and stay motivated.
      </p>
      
      <ul className="about-features">
    <li><i className="fas fa-bolt"></i> Unlock your potential with our expert Personal Trainers.</li>
    <li><i className="fas fa-dumbbell"></i> Elevate your fitness with practice sessions.</li>
    <li><i className="fas fa-heartbeat"></i> We provide Supportive management, for your fitness success.</li>
</ul>

      <button className="join-btn-fill mt-8">
        Book A Free Class
      </button>
    </div>

  </div>
</section>

     <section className="pricing" id="pricing">
    <h2>Our <span>Pricing</span> Plans</h2>
    <div className="pricing-container">
        {/* Standard Plan */}
        <div className="price-card">
            <h3>Standard</h3>
            <div className="price">₹200<span>/month</span></div>
            <ul>
                <li><i className="fas fa-check"></i> 5 Days a Week</li>
                <li><i className="fas fa-check"></i> Basic Gym Access</li>
                <li><i className="fas fa-times"></i> Personal Trainer</li>
                <li><i className="fas fa-times"></i> Diet Plan</li>
            </ul>
            <button className="join-btn-outline">Choose Plan</button>
        </div>

        {/* Professional Plan (Popular) */}
        <div className="price-card popular">
            <div className="badge">Most Popular</div>
            <h3>Professional</h3>
            <div className="price">₹500<span>/month</span></div>
            <ul>
                <li><i className="fas fa-check"></i> Full Week Access</li>
                <li><i className="fas fa-check"></i> Personal Trainer</li>
                <li><i className="fas fa-check"></i> Standard Diet Plan</li>
                <li><i className="fas fa-check"></i> Locker Room</li>
            </ul>
            <button className="join-btn-fill">Choose Plan</button>
        </div>

        {/* Ultimate Plan */}
        <div className="price-card">
            <h3>Ultimate</h3>
            <div className="price">₹1000<span>/month</span></div>
            <ul>
                <li><i className="fas fa-check"></i> 24/7 Access</li>
                <li><i className="fas fa-check"></i> Pro Personal Trainer</li>
                <li><i className="fas fa-check"></i> Customized Diet</li>
                <li><i className="fas fa-check"></i> Sauna & Spa</li>
            </ul>
            <button className="join-btn-outline">Choose Plan</button>
        </div>
    </div>
</section>

      <section className="reviews" id="review">
  <h2>Client <span>Reviews</span></h2>
  <div className="review-container">
    {/* Review 1 */}
    <div className="review-card">
      <div className="profile-img">
        <img src="client1.jpg" alt="Nivetha" />
      </div>
      <h3>Nivetha</h3>
      <div className="stars">⭐⭐⭐⭐⭐</div>
      <p>"Best gym in the city! The trainers are very professional and the equipment is top notch."</p>
    </div>

    {/* Review 2 */}
    <div className="review-card">
      <div className="profile-img">
        <img src="client2.jpg" alt="Mounika" />
      </div>
      <h3>Mounika</h3>
      <div className="stars">⭐⭐⭐⭐</div>
      <p>"Love the atmosphere here. The community is very supportive for beginners."</p>
    </div>

    {/* Review 3 */}
    <div className="review-card">
      <div className="profile-img">
        <img src="client3.jpg" alt="Priyanka" />
      </div>
      <h3>Priyanka</h3>
      <div className="stars">⭐⭐⭐⭐⭐</div>
      <p>"Highly recommend the Professional plan. The diet chart really helped my progress."</p>
    </div>
  </div>
</section>


      <footer className="p-10 text-center text-[#555] border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} Wellnest Smart Health. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
