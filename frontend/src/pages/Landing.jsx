import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="layout-container" style={{ display: 'block' }}>
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-logo text-gradient">
            FetalVision AI
          </div>
          <div className="landing-links">
            <Link to="/login" className="landing-login-link">Log in</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="landing-main text-center">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="landing-hero-title"
          >
            Advanced Fetal Ultrasound <br/>
            <span className="text-gradient">Analysis Platform</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="landing-hero-subtitle"
          >
            Empowering maternal-fetal medicine specialists with FetalCLIP vision-language foundation model for rapid, accurate, zero-shot ultrasound analysis.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="landing-actions"
          >
            <Link to="/register" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>Start Analyzing</Link>
            <Link to="/about" className="btn-primary" style={{ background: 'var(--color-white)', color: 'var(--color-slate-700)', border: '1px solid var(--color-slate-200)', padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Learn about FetalCLIP
            </Link>
          </motion.div>
        </div>

        <div className="landing-preview-container">
          <div className="glass-card" style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="landing-preview-mockup">
               {/* Placeholder for dashboard screenshot */}
               <div className="landing-preview-placeholder">
                 <p>Premium SaaS Interface Preview</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
