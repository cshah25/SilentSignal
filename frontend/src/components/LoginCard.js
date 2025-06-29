import React from 'react';
import '../styles/LoginCard.css'; // Make sure to create this CSS file with matching styles

export default function LoginCard({ inputValue, onInputChange, onSubmit, checking, error }) {
  return (
    <div className="frame-1-1">
      <div className='centered-signin'>
        <div className='bg-dark-blue'>
          <p className="sign-in-text">Please Sign In to see your Microphone History</p>
          <div className="input-fields-6 input-form">
            <form onSubmit={onSubmit}>
              <div className="value-main-10">
                <div className="value-masked-12">
                  <div className="mask-layer-13">
                    <input
                      type="text"
                      className="text-14"
                      value={inputValue}
                      onChange={(e) => onInputChange(e.target.value)}
                      disabled={checking}
                      placeholder="Enter your user ID"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" disabled={checking} className="group-5-3">
                <p className="text-5">Continue</p>
              </button>
            {error && <p className="text-rgb-231-16-16">{error}</p>}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
