import React from 'react';
import MusicPlayer from './MusicPlayer';

function HomePage({ onLoginClick }) {
    return (
        <div className="my-5 text-center">
            <MusicPlayer />
            <button
                onClick={onLoginClick}
                className="btn btn-light mt-3"
            >
                Login
            </button>
        </div>
    );
}

export default HomePage;