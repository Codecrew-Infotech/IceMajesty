import { useState, useEffect } from 'react';
import { Card, BlockStack, Checkbox, RangeSlider, Button } from '@shopify/polaris';
import rocket from "../assets/rocket.png";
import diya from "../assets/diya.gif";
import sparkle from "../assets/sparkle.gif";
import marigold from "../assets/marigold.png";
import santa from "../assets/santa.gif";

// Effect image assets
const effectAssets = {
  diya: diya,
  sparkle: sparkle,
  marigold: marigold,
  pumpkin: 'https://cdn.shopify.com/extensions/a58d0be2-b9c6-432f-9e25-9b806a49e22f/0.0.0/assets/dakaas-hallowin.png',
  santa: santa,
  witch: 'https://files.resumeily.com/shopify/witch.gif',
  bat: 'https://files.resumeily.com/shopify/bat.gif',
  summersale: 'https://cdn.shopify.com/extensions/a58d0be2-b9c6-432f-9e25-9b806a49e22f/0.0.0/assets/dakaas-hotsale.png',
  bigsale: 'https://cdn.shopify.com/extensions/a58d0be2-b9c6-432f-9e25-9b806a49e22f/0.0.0/assets/dakaas-bigsale.png',
  diwalirocket: rocket,
  newyear: 'https://files.resumeily.com/shopify/dakaas-new-year.webp',
};

export default function EffectsCard() {
  const [selectedEffect, setSelectedEffect] = useState(null);
  
  const effects = {
    diwaliFireworks: false,
    diwaliRocket: false,
    diya: false,
    happyNewYear: false,
    sparkle: false,
    marigold: false,
    snowfall: false,
    christmasSanta: false,
    halloweenPumpkin: false,
    halloweenBats: false,
    flyingWitch: false,
    summerSale: false,
    bigSale: false,
  };
  
  // Set the selected effect to active
  if (selectedEffect) {
    effects[selectedEffect] = true;
  }

  const [rocketCount, setRocketCount] = useState(3);
  const [diyaCount, setDiyaCount] = useState(15);
  const [confettiCount, setConfettiCount] = useState(150);
  const [sparkleCount, setSparkleCount] = useState(50);
  const [flowerCount, setFlowerCount] = useState(30);
  const [snowCount, setSnowCount] = useState(100);
  const [santaCount, setSantaCount] = useState(3);
  const [pumpkinCount, setPumpkinCount] = useState(8);
  const [batCount, setBatCount] = useState(12);
  const [witchCount, setWitchCount] = useState(1);
  const [saleCount, setSaleCount] = useState(20);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 9999,
  };

  // Helper function for image-based effects
  const createImageEffect = (effectKey, imageUrl, count, animationSpeed = 10) => {
    useEffect(() => {
      if (!effects[effectKey] || !isClient) return;
      
      const container = document.createElement('div');
      container.id = `dakaas-${effectKey}`;
      container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
      document.body.appendChild(container);

      const items = [];
      
      for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.cssText = 'position:absolute;width:45px;height:45px;display:block;';
        img.style.left = Math.random() * window.innerWidth + 'px';
        img.style.top = -50 + 'px';
        container.appendChild(img);
        
        items.push({
          el: img,
          x: Math.random() * window.innerWidth,
          y: -50 - Math.random() * 200,
          speed: 1 + Math.random() * 2,
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.01 + Math.random() * 0.02,
        });
      }

      function animate() {
        items.forEach(item => {
          item.y += item.speed;
          item.sway += item.swaySpeed;
          item.x += Math.sin(item.sway) * 0.5;
          
          if (item.y > window.innerHeight) {
            item.y = -50;
            item.x = Math.random() * window.innerWidth;
          }
          
          item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;
        });
        
        if (effects[effectKey]) {
          requestAnimationFrame(animate);
        }
      }
      
      animate();
      
      return () => {
        container.remove();
      };
    }, [effects[effectKey], isClient]);
  };

  // Diwali Fireworks
  useEffect(() => {
    if (!effects.diwaliFireworks || !isClient) return;
    const canvas = document.getElementById('canvas-diwaliFireworks');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];
    
    function createFirework() {
      const colors = ['#ff0000', '#ffd700', '#ff6600', '#ff1493', '#00ff00'];
      fireworks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        particles: Array.from({ length: 60 }, () => ({
          angle: Math.random() * Math.PI * 2,
          speed: 2 + Math.random() * 4,
          life: 60,
          color: colors[Math.floor(Math.random() * colors.length)]
        }))
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      fireworks.forEach((fw, i) => {
        fw.particles.forEach(p => {
          p.x = fw.x + Math.cos(p.angle) * p.speed * (60 - p.life);
          p.y = fw.y + Math.sin(p.angle) * p.speed * (60 - p.life);
          p.life--;
          
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
        
        fw.particles = fw.particles.filter(p => p.life > 0);
        if (fw.particles.length === 0) fireworks.splice(i, 1);
      });
      
      requestAnimationFrame(animate);
    }

    const interval = setInterval(createFirework, 1000);
    animate();
    return () => clearInterval(interval);
  }, [effects.diwaliFireworks, isClient]);

  // Diwali Rocket with GIF
  createImageEffect('diwaliRocket', effectAssets.diwalirocket, rocketCount, 15);

  // Diya with GIF
  createImageEffect('diya', effectAssets.diya, diyaCount, 0);

  // Happy New Year (confetti)
  useEffect(() => {
    if (!effects.happyNewYear || !isClient) return;
    const canvas = document.getElementById('canvas-happyNewYear');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti = Array.from({ length: confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 2,
      color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confetti.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.fillRect(-5, -2, 10, 4);
        ctx.restore();
        
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        
        if (c.y > canvas.height) {
          c.y = -10;
          c.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }, [effects.happyNewYear, confettiCount, isClient]);

  // Sparkle with GIF
  createImageEffect('sparkle', effectAssets.sparkle, sparkleCount, 5);

  // Marigold with Image
  createImageEffect('marigold', effectAssets.marigold, flowerCount, 10);

  // Snowfall
  useEffect(() => {
    if (!effects.snowfall || !isClient) return;
    const canvas = document.getElementById('canvas-snowfall');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let snowflakes = Array.from({ length: snowCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 3,
      d: Math.random() * 2,
    }));

    function animateSnow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      snowflakes.forEach((s) => {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.d;
        if (s.y > canvas.height) s.y = 0;
      });
      requestAnimationFrame(animateSnow);
    }

    animateSnow();
  }, [effects.snowfall, snowCount, isClient]);

  // Christmas Santa with GIF
  createImageEffect('christmasSanta', effectAssets.santa, santaCount, 15);

  // Halloween Pumpkin with Image
  createImageEffect('halloweenPumpkin', effectAssets.pumpkin, pumpkinCount, 8);

  // Halloween Bats with GIF
  createImageEffect('halloweenBats', effectAssets.bat, batCount, 12);

  // Flying Witch with GIF
  createImageEffect('flyingWitch', effectAssets.witch, witchCount, 15);

  // Summer Sale with Image
  createImageEffect('summerSale', effectAssets.summersale, saleCount, 10);

  // Big Sale with Image
  createImageEffect('bigSale', effectAssets.bigsale, saleCount, 10);

  return (
    <>
      <Card padding="0">
        <BlockStack gap="400" padding="400">
          {Object.keys(effects).map((key) => {
            const isActive = selectedEffect === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedEffect(isActive ? null : key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  border: `2px solid ${isActive ? '#008060' : '#e1e3e5'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#f4f6f8' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#008060' : '#202223'
                }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </span>
                <div
                  style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: isActive ? '#008060' : '#c9cccf',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: isActive ? '22px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {selectedEffect === 'diwaliRocket' && (
            <RangeSlider
              label="Number of Rockets"
              value={rocketCount}
              min={1}
              max={15}
              step={1}
              onChange={setRocketCount}
              output
            />
          )}

          {selectedEffect === 'diya' && (
            <RangeSlider
              label="Number of Diyas"
              value={diyaCount}
              min={1}
              max={30}
              step={1}
              onChange={setDiyaCount}
              output
            />
          )}

          {selectedEffect === 'happyNewYear' && (
            <RangeSlider
              label="Number of Confetti"
              value={confettiCount}
              min={50}
              max={300}
              step={10}
              onChange={setConfettiCount}
              output
            />
          )}

          {selectedEffect === 'sparkle' && (
            <RangeSlider
              label="Number of Sparkles"
              value={sparkleCount}
              min={10}
              max={150}
              step={5}
              onChange={setSparkleCount}
              output
            />
          )}

          {selectedEffect === 'marigold' && (
            <RangeSlider
              label="Number of Flowers"
              value={flowerCount}
              min={5}
              max={60}
              step={5}
              onChange={setFlowerCount}
              output
            />
          )}

          {selectedEffect === 'snowfall' && (
            <RangeSlider
              label="Number of Snowflakes"
              value={snowCount}
              min={50}
              max={400}
              step={10}
              onChange={setSnowCount}
              output
            />
          )}

          {selectedEffect === 'christmasSanta' && (
            <RangeSlider
              label="Number of Santas"
              value={santaCount}
              min={1}
              max={5}
              step={1}
              onChange={setSantaCount}
              output
            />
          )}

          {selectedEffect === 'halloweenPumpkin' && (
            <RangeSlider
              label="Number of Pumpkins"
              value={pumpkinCount}
              min={1}
              max={20}
              step={1}
              onChange={setPumpkinCount}
              output
            />
          )}

          {selectedEffect === 'halloweenBats' && (
            <RangeSlider
              label="Number of Bats"
              value={batCount}
              min={1}
              max={30}
              step={1}
              onChange={setBatCount}
              output
            />
          )}

          {selectedEffect === 'flyingWitch' && (
            <RangeSlider
              label="Number of Witches"
              value={witchCount}
              min={1}
              max={5}
              step={1}
              onChange={setWitchCount}
              output
            />
          )}

          {(selectedEffect === 'summerSale' || selectedEffect === 'bigSale') && (
            <RangeSlider
              label="Number of Sale Icons"
              value={saleCount}
              min={5}
              max={50}
              step={5}
              onChange={setSaleCount}
              output
            />
          )}

          <Button variant="primary" onClick={() => console.log('Saved')}>
            Save
          </Button>
        </BlockStack>
      </Card>

      {/* Canvases for canvas-based effects */}
      {isClient && effects.diwaliFireworks && <canvas id="canvas-diwaliFireworks" style={canvasStyle} />}
      {isClient && effects.happyNewYear && <canvas id="canvas-happyNewYear" style={canvasStyle} />}
      {isClient && effects.snowfall && <canvas id="canvas-snowfall" style={canvasStyle} />}
    </>
  );
}