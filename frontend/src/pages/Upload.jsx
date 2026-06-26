import { useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/dicom'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.dicom')) {
      toast.error('Invalid file type. Only JPEG, PNG, and DICOM are supported.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size exceeds 20MB limit.');
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const handlePredict = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setResult(res.data);
      toast.success('Analysis complete');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h2 className="upload-title">Analyze Ultrasound Image</h2>
      </div>

      <div className="upload-grid">
        {/* Upload Section */}
        <div className="glass-card upload-section">
          {!preview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
            >
              <FiUploadCloud className="upload-icon" />
              <div className="upload-text-wrapper">
                <label
                  htmlFor="file-upload"
                  className="upload-label"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" style={{ display: 'none' }} onChange={handleFileChange} accept=".jpg,.jpeg,.png,.dicom" />
                </label>
                <p style={{ paddingLeft: '0.25rem' }}>or drag and drop</p>
              </div>
              <p className="upload-hint">PNG, JPG, DICOM up to 20MB</p>
            </div>
          ) : (
            <div className="upload-preview-wrapper">
              <div className="upload-image-container">
                <img src={preview} alt="Preview" className="upload-preview-img" />
                <button
                  onClick={clearFile}
                  className="upload-clear-btn"
                >
                  <FiX size={18} />
                </button>
              </div>
              
              <div className="file-info-card">
                <FiFile className="file-info-icon" />
                <div className="file-info-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="btn-primary upload-predict-btn"
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with FetalCLIP...
                  </span>
                ) : 'Run AI Analysis'}
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="glass-card results-section">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="empty-results"
              >
                <FiCheckCircle size={48} className="empty-results-icon" />
                <p>Upload an image and run analysis<br/>to see results here.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="result-container"
              >
                <div>
                  <h3 className="result-header">AI Diagnosis</h3>
                  <div className="result-prediction-wrapper">
                    <p className="result-prediction-name">{result.prediction}</p>
                    <span className={`result-confidence-badge ${result.confidence > 90 ? 'high' : 'low'}`}>
                      {result.confidence}% Confident
                    </span>
                  </div>
                </div>

                <div className="cam-section">
                  <h3 className="cam-title">Class Activation Map (Heatmap)</h3>
                  <div className="cam-image-wrapper">
                    <img 
                      src={`http://localhost:5000/uploads/${result.camImage}`} 
                      alt="CAM Heatmap" 
                      className="cam-image"
                    />
                  </div>
                  <p className="cam-caption">Heatmap highlights regions the AI focused on for prediction.</p>
                </div>

                <div className="result-footer">
                  <span>Processing Time: {result.processing_time}</span>
                  <a href={`/app/history/${result.id}`} className="history-link">View in History &rarr;</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Upload;
