import { useState } from "react";
import BackgroundImage from "../assets/background.png";
import { scene } from "../config/scene";
import Start from "../assets/startbutton.png";
import HintBox from "@/components/hints";
import Timer from "@/components/GameTimer.jsx";

export default function OceanScene() {
  const [activeId, setActiveId] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [showTimer , setShowTimer] = useState(false);

  const handleClick = (e, id) => {
    e.stopPropagation();
    setActiveId((cur) => (cur === id ? null : id));
  };

  const closeActive = () => setActiveId(null);

  // when start button is clicked: open popup and hide the button
  const handleStartClick = (e) => {
    e.stopPropagation();
    setShowFinalPopup(true);
    setShowTimer(true);
    setShowStartButton(false);
  };

  // when popup closes, decide whether to show the start button again
  const handlePopupClose = () => {
    setShowFinalPopup(false);
    setShowTimer(false);
    setShowStartButton(true);
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-bottom bg-no-repeat z-4 overflow-hidden"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
      }}
      onClick={closeActive}
    >
      {/* scene objects */}
      {scene.map((item, i) => {
        const id = `object-${i}`;
        const isActive = activeId === id;
        const baseZ = item.zindex ?? 1;
        return (
          <img
            key={id}
            id={id}
            data-object-id={id}
            src={item.src}
            alt={item.name}
            className={`absolute object-hoverable transition-transform duration-200 ease-out ${isActive ? "object-active" : ""}`}
            onClick={(e) => handleClick(e, id)}
            style={{
              top: item.top,
              left: item.left,
              height: item.height,
              width: item.width,
              zIndex: isActive ? 2000 : baseZ,
              cursor: "pointer",
              // when some object is active, prevent interacting with all non-active objects
              pointerEvents: activeId && !isActive ? "none" : "auto",
            }}
          />
        );
      })}

      {/* overlay that dims the scene when an object is active */}
      {activeId && (
        <div
          className="scene-overlay"
          onClick={closeActive}
          aria-hidden="true"
        />
      )}

      {showStartButton && (
        <img
          src={Start}
          alt="Start"
          role="button"
          onClick={handleStartClick}
          className="absolute"
          style={{
            bottom: "10vh",
            left: "45%",
            width: 170,
            height: "auto",
            zIndex: 3000,
            cursor: "pointer",
          }}
          onKeyDown={(e) => { if (e.key === "Enter") handleStartClick(e); }}
          tabIndex={0}
        />
      )}

      {showFinalPopup && [
        <HintBox onClose={handlePopupClose}/>,
        <Timer onClose={handlePopupClose}/>
      ]}
    </div>
  );
}