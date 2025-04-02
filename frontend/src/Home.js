import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

const Home = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="home-container">
      <Particles
        className="particles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 100, density: { enable: true, area: 800 } },
            color: { value: ["#ffffff", "#00ff88", "#00b4d8"] },
            opacity: { value: { min: 0.3, max: 0.8 }, random: true },
            size: { value: { min: 1, max: 3 }, random: true },
            move: { enable: true, speed: 0.6, random: true, outModes: "out" },
            links: {
              enable: true,
              distance: 130,
              color: "#ffffff",
              opacity: 0.2,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
            },
          },
        }}
      />
      <div className="home-content">
        <h1 className="home-title">MUResourceX</h1>
        <div className="role-buttons">
          <button className="role-btn" onClick={() => navigate("/student")}>
            Student
          </button>
          <button className="role-btn" onClick={() => navigate("/admin")}>
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
