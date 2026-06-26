import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="layout-container" style={{ display: 'block' }}>
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <Link to="/" className="landing-logo text-gradient">
            FetalVision AI
          </Link>
          <div className="landing-links">
            <Link to="/login" className="landing-login-link">Log in</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="about-main">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="about-header"
        >
          <h1 className="about-title">About FetalVision AI</h1>
          <p className="about-subtitle">The next generation platform for maternal-fetal ultrasound analysis.</p>
        </motion.div>

        <div className="about-content">
          <section className="about-section glass-card">
            <h2 className="section-heading">What is FetalVision AI?</h2>
            <p>
              FetalVision AI is an advanced, production-ready medical platform built around the powerful FetalCLIP model. 
              It provides a seamless, zero-shot AI diagnosis workflow for maternal-fetal medicine specialists to analyze 
              ultrasound images instantly with high accuracy.
            </p>
          </section>

          <section className="about-section glass-card">
            <h2 className="section-heading">Why We Built This Platform</h2>
            <p>
              Maternal-fetal ultrasound diagnosis traditionally requires immense expertise and time. 
              By wrapping state-of-the-art vision-language AI inside a premium, secure SaaS architecture, 
              we empower doctors to reduce diagnostic time, minimize human error, and instantly access heatmaps 
              (Class Activation Maps) detailing exactly where the AI identified anomalies.
            </p>
          </section>

          <section className="about-section glass-card">
            <h2 className="section-heading">AI Workflow Overview</h2>
            <ol className="about-list">
              <li><strong>Secure Upload:</strong> The doctor uploads a standard or DICOM ultrasound image.</li>
              <li><strong>Inference:</strong> The image is securely processed by the backend using the FetalCLIP model.</li>
              <li><strong>Diagnosis:</strong> The vision-language model generates a zero-shot diagnosis.</li>
              <li><strong>Heatmap Generation:</strong> A CAM heatmap is generated to provide visual interpretability.</li>
              <li><strong>Results:</strong> The prediction, confidence score, and heatmap are returned to the interactive dashboard.</li>
            </ol>
          </section>

          <section className="about-section glass-card">
            <h2 className="section-heading">Platform Features</h2>
            <ul className="about-list">
              <li>Instant AI-powered ultrasound analysis</li>
              <li>Secure Authentication & Role-Based Access Control</li>
              <li>Premium, responsive Glassmorphism UI</li>
              <li>Comprehensive patient prediction history</li>
              <li>Interactive dashboard with real-time analytics</li>
              <li>Interpretable AI with visual heatmaps</li>
            </ul>
          </section>
          
          <section className="about-section glass-card">
            <h2 className="section-heading">Technology Stack</h2>
            <div className="tech-grid">
              <div className="tech-badge">React 19</div>
              <div className="tech-badge">Vite</div>
              <div className="tech-badge">Node.js</div>
              <div className="tech-badge">Express</div>
              <div className="tech-badge">PostgreSQL</div>
              <div className="tech-badge">Prisma ORM</div>
              <div className="tech-badge">Python</div>
              <div className="tech-badge">PyTorch</div>
            </div>
          </section>

          <section className="about-section glass-card text-center contact-section">
            <h2 className="section-heading">Ready to revolutionize your practice?</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-slate-600)' }}>
              Get started with FetalVision AI today and experience the future of maternal-fetal medicine.
            </p>
            <Link to="/register" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Create an Account
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
