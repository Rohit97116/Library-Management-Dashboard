import React from 'react';
import PixelSnow from './PixelSnow';
import './GlobalBackground.css';

export default function GlobalBackground({ children }) {
  return (
    <>
      <div className="global-bg" aria-hidden="true">
        <div className="pixel-snow-wrapper">
          <PixelSnow
            color="#ffffff"
            flakeSize={0.011}
            minFlakeSize={1.25}
            pixelResolution={500}
            speed={2.5}
            density={1}
            direction={100}
            brightness={3}
            depthFade={20}
            farPlane={20}
            gamma={0.4545}
            variant="snowflake"
            className="pixel-snow"
          />
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </>
  );
}
