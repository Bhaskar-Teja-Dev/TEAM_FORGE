import { useState, useRef } from 'react';
import './SwipeCard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function SwipeCard({ candidate, index, onLike, onPass }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const startRef = useRef({ x: 0, y: 0 });

  const onPointerDown = (e) => {
    if (index !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!dragging || index !== 0) return;

    setPos({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    });
  };

  const onPointerUp = () => {
    if (!dragging || index !== 0) return;

    setDragging(false);

    if (pos.x > 120) onLike();
    else if (pos.x < -120) onPass();
    else setPos({ x: 0, y: 0 });
  };

  const wash = Math.min(Math.abs(pos.x) / 180, 1);
  const direction = pos.x > 0 ? 'right' : pos.x < 0 ? 'left' : '';

  return (
    <div
      className={`swipe-card ${direction}`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.x * 0.08}deg)`,
        boxShadow:
          direction === 'right'
            ? `0 0 40px rgba(0,255,0,${wash})`
            : direction === 'left'
            ? `0 0 40px rgba(255,0,0,${wash})`
            : 'none',
        '--wash': wash,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="card-header">
        <div className="compatibility-badge">
          {candidate.compatibility}% Match ✨
          {candidate.matchExplanation && (
            <span className="why">
              Why?
              <span className="tooltip">
                {candidate.matchExplanation}
              </span>
            </span>
          )}
        </div>
      </div>

      <img
        className="card-image"
        src={`${API_URL}${candidate.profileImage}`}
        alt={candidate.fullName}
        draggable={false}
      />

      <div className="card-overlay">
        <h2>{candidate.fullName}</h2>
        <p>{candidate.bio}</p>
      </div>
    </div>
  );
}

export default SwipeCard;
