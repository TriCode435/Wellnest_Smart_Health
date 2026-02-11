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
      <section className="services p-[80px_10%] text-center" id="services">
        <h2 className="text-4xl font-['Bebas_Neue'] tracking-[2px] text-white mb-12">
          Our <span className="text-[#4ade80]">Services</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -5 }} className="service-card bg-[#141414] border border-[#333] p-5 rounded-2xl text-left hover:border-[#4ade80] transition-all">
            <img src="/src/assets/physical.jpg" alt="Physical Fitness" className="w-full rounded-xl mb-4" />
            <h3 className="text-xl font-bold text-white">Physical Fitness</h3>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="service-card bg-[#141414] border border-[#333] p-5 rounded-2xl text-left hover:border-[#4ade80] transition-all">
            <img src="/src/assets/weight-gain.jpg" alt="Weight Gain" className="w-full rounded-xl mb-4" />
            <h3 className="text-xl font-bold text-white">Weight Gain</h3>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="service-card bg-[#141414] border border-[#333] p-5 rounded-2xl text-left hover:border-[#4ade80] transition-all">
            <img src="/src/assets/strength.jpg" alt="Strength Training" className="w-full rounded-xl mb-4" />
            <h3 className="text-xl font-bold text-white">Strength Training</h3>
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <section className="about-us p-[80px_10%]" id="about">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <img src="/src/assets/treadmill-man.jpg" alt="About Us" className="w-full rounded-2xl border border-[#333]" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl font-['Bebas_Neue'] tracking-[2px] text-white mb-6">
              Why <span className="text-[#4ade80]">Choose Us?</span>
            </h2>
            <p className="text-[#ccc] text-lg leading-relaxed mb-8">
              Our diverse membership base creates a friendly and supportive atmosphere, where you can make friends and stay motivated.
            </p>
            <ul className="list-none p-0 text-left">
              <li className="flex items-center gap-4 mb-4 text-[#ccc]">
                <i className="fas fa-bolt p-3 bg-[#1a1a1a] rounded-full text-[#4ade80]"></i>
                <span>Unlock your potential with our expert Personal Trainers.</span>
              </li>
              <li className="flex items-center gap-4 mb-4 text-[#ccc]">
                <i className="fas fa-dumbbell p-3 bg-[#1a1a1a] rounded-full text-[#4ade80]"></i>
                <span>Elevate your fitness with practice sessions.</span>
              </li>
              <li className="flex items-center gap-4 mb-8 text-[#ccc]">
                <i className="fas fa-heartbeat p-3 bg-[#1a1a1a] rounded-full text-[#4ade80]"></i>
                <span>We provide Supportive management, for your fitness success.</span>
              </li>
            </ul>
            <button className="join-btn-fill bg-[#4ade80] text-black font-bold px-8 py-3 rounded hover:scale-105 transition-all">
              Book A Free Class
            </button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing p-[80px_10%] text-center" id="pricing">
        <h2 className="text-4xl font-['Bebas_Neue'] tracking-[2px] text-white mb-12">
          Our <span className="text-[#4ade80]">Pricing</span> Plans
        </h2>
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <div className="price-card bg-[#141414] border border-[#333] p-10 rounded-[20px] w-full max-w-[280px] hover:border-[#4ade80] transition-all group">
            <h3 className="text-xl font-bold text-white mb-4">Standard</h3>
            <div className="price text-5xl font-bold text-white my-5">₹200<span className="text-base text-[#aaa]">/month</span></div>
            <ul className="list-none p-0 mb-8 text-left space-y-4">
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> 5 Days a Week</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Basic Gym Access</li>
              <li className="text-[#ccc]"><i className="fas fa-times text-[#ff4d4d] mr-2"></i> Personal Trainer</li>
              <li className="text-[#ccc]"><i className="fas fa-times text-[#ff4d4d] mr-2"></i> Diet Plan</li>
            </ul>
            <button className="join-btn-outline w-full hover:bg-[#4ade80] hover:text-black">Choose Plan</button>
          </div>

          <div className="price-card popular bg-[#141414] border-2 border-[#4ade80] p-10 rounded-[20px] w-full max-w-[280px] relative scale-105">
            <div className="badge absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4ade80] text-black px-4 py-1 rounded-full font-bold text-sm">Most Popular</div>
            <h3 className="text-xl font-bold text-white mb-4">Professional</h3>
            <div className="price text-5xl font-bold text-white my-5">₹500<span className="text-base text-[#aaa]">/month</span></div>
            <ul className="list-none p-0 mb-8 text-left space-y-4">
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Full Week Access</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Personal Trainer</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Standard Diet Plan</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Locker Room</li>
            </ul>
            <button className="join-btn-fill w-full">Choose Plan</button>
          </div>

          <div className="price-card bg-[#141414] border border-[#333] p-10 rounded-[20px] w-full max-w-[280px] hover:border-[#4ade80] transition-all">
            <h3 className="text-xl font-bold text-white mb-4">Ultimate</h3>
            <div className="price text-5xl font-bold text-white my-5">₹1000<span className="text-base text-[#aaa]">/month</span></div>
            <ul className="list-none p-0 mb-8 text-left space-y-4">
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> 24/7 Access</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Pro Personal Trainer</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Customized Diet</li>
              <li className="text-[#ccc]"><i className="fas fa-check text-[#4ade80] mr-2"></i> Sauna & Spa</li>
            </ul>
            <button className="join-btn-outline w-full hover:bg-[#4ade80] hover:text-black">Choose Plan</button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews p-[80px_10%] text-center" id="review">
        <h2 className="text-4xl font-['Bebas_Neue'] tracking-[2px] text-white mb-12">
          Client <span className="text-[#4ade80]">Reviews</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-8 pt-10">
          <div className="review-card bg-[#141414] border border-[#333] p-8 rounded-[20px] w-full max-w-[300px]">
            <div className="w-20 h-20 rounded-full border-3 border-[#4ade80] mx-auto mb-4 overflow-hidden">
              <img src="/src/assets/client1.jpg" alt="Nivetha" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nivetha</h3>
            <div className="text-[#f1c40f] mb-4">⭐⭐⭐⭐⭐</div>
            <p className="text-[#ccc]">"Best gym in the city! The trainers are very professional and the equipment is top notch."</p>
          </div>
          <div className="review-card bg-[#141414] border border-[#333] p-8 rounded-[20px] w-full max-w-[300px]">
            <div className="w-20 h-20 rounded-full border-3 border-[#4ade80] mx-auto mb-4 overflow-hidden">
              <img src="/src/assets/client2.jpg" alt="Mounika" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Mounika</h3>
            <div className="text-[#f1c40f] mb-4">⭐⭐⭐⭐</div>
            <p className="text-[#ccc]">"Love the atmosphere here. The community is very supportive for beginners."</p>
          </div>
          <div className="review-card bg-[#141414] border border-[#333] p-8 rounded-[20px] w-full max-w-[300px]">
            <div className="w-20 h-20 rounded-full border-3 border-[#4ade80] mx-auto mb-4 overflow-hidden">
              <img src="/src/assets/client3.jpg" alt="Priyanka" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Priyanka</h3>
            <div className="text-[#f1c40f] mb-4">⭐⭐⭐⭐⭐</div>
            <p className="text-[#ccc]">"Highly recommend the Professional plan. The diet chart really helped my progress."</p>
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
