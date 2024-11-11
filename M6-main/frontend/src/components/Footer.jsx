import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          
          {/* Sezione Logo e Descrizione */}
          <div className="col-md-3 mb-4 text-center text-md-start">
            <h5>My Blog App</h5>
            <p>Exploring ideas and sharing insights on a variety of topics that matter.</p>
          </div>
          
          {/* Link di navigazione rapida */}
          <div className="col-md-3 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About Us</a></li>
              <li><a href="/blog-posts" className="text-white">Blog Posts</a></li>
              <li><a href="/contact" className="text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Risorse legali */}
          <div className="col-md-3 mb-4">
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li><a href="/privacy-policy" className="text-white">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="text-white">Terms of Service</a></li>
            </ul>
          </div>

          {/* Collegamenti social */}
          <div className="col-md-3 mb-4 text-center text-md-end">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-end">
              <a href="https://facebook.com" className="text-white me-3" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebook} size="lg" />
              </a>
              <a href="https://instagram.com" className="text-white me-3" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
              </a>
              <a href="https://twitter.com" className="text-white me-3" aria-label="Twitter">
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a href="https://linkedin.com" className="text-white" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
            </div>
          </div>
        </div>
        
        <hr className="bg-light" />

        <div className="row">
          <div className="col text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} My Blog App. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
