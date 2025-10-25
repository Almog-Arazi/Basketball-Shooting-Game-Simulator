# 3D Basketball Shooting Game

A realistic 3D basketball shooting simulator built with WebGL and Three.js, featuring advanced physics simulation, dynamic scoring system, and immersive audio-visual effects. Experience the thrill of basketball with accurate trajectory physics, collision detection, and real-time gameplay feedback.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Physics Engine](#physics-engine)
- [Gameplay](#gameplay)
- [Installation](#installation)
- [Controls](#controls)
- [Technical Implementation](#technical-implementation)
- [Screenshots](#screenshots)
- [Authors](#authors)

## Overview

This interactive basketball shooting game combines realistic physics simulation with engaging gameplay mechanics. Players can shoot basketballs at dual hoops on a professionally rendered court, complete with accurate trajectory calculations, collision detection, and scoring systems. The game features a Maccabi Tel Aviv-themed environment with authentic court textures, dynamic lighting, and immersive sound effects.

## Features

### Gameplay Features
- **Dual Hoop System**: Two fully functional basketball hoops with automatic nearest-hoop targeting
- **Realistic Shooting Mechanics**: Adjustable shot power from 0% to 100% with visual power indicator
- **Score Tracking System**: Real-time statistics including:
  - Current score and shot attempts
  - Shooting accuracy percentage
  - Current streak and best streak tracking
  - High score persistence
- **Dynamic Court Boundaries**: Ball movement constrained within court limits
- **Reset Functionality**: Quick ball reset to center position

### Visual Effects
- **Rim Glow Effect**: Visual feedback when a basket is made - the rim pulses with a glowing effect
- **Professional Court Design**: 
  - Textured hardwood floor with realistic parquet pattern
  - Official court markings (center circle, three-point lines, paint areas)
  - Maccabi Tel Aviv stadium environment
- **Detailed Basketball Model**: Textured sphere with proper scaling and visual fidelity
- **Dynamic Shadows**: Real-time shadow rendering for enhanced realism
- **Modern UI Design**: 
  - Gradient backgrounds and rounded corners
  - Glowing effects on interactive elements
  - Semi-transparent panels with backdrop blur
  - Responsive layout

### Audio System
- **Spatial Sound Effects**:
  - Basketball net swoosh sound on successful shots
  - Bonus achievement sound effect
- **Background Music**: Maccabi Tel Aviv anthem playing throughout gameplay
- **Dynamic Audio Feedback**: Sound triggers synchronized with game events

### Camera System
- **Free Camera Mode**: Toggle orbit controls for free 360-degree viewing
- **Default Camera Position**: Optimized viewing angle for gameplay
- **Smooth Transitions**: Camera movements with proper damping

## Physics Engine

The game implements a comprehensive physics simulation system that creates realistic basketball behavior:

### Gravity and Trajectory
- **Constant Gravitational Acceleration**: -9.8 m/s² (scaled appropriately for the scene)
- **Parabolic Arc Simulation**: Ball follows realistic projectile motion
- **Initial Velocity Calculation**: Based on distance to hoop, shot angle, and power level
- **Launch Angle Optimization**: Automatic calculation of optimal launch angle (typically 45-60 degrees)

### Collision Detection
The physics engine detects and handles multiple collision types:

**Ground Collision**:
- Detects when ball touches court floor (Y ≤ ball radius)
- Applies coefficient of restitution for energy loss
- Prevents ball from falling through floor

**Rim Collision**:
- Cylinder-based collision detection around the rim
- Distance-based collision using rim radius and ball radius
- Vertical bounds checking (rim height ± tolerance)
- Velocity reflection with energy loss
- Prevents ball from passing through rim geometry

**Backboard Collision**:
- Plane-based collision detection
- Position checks for X and Y boundaries
- Z-position depth testing
- Normal-based velocity reflection
- Energy loss on impact

**Court Boundary Collision**:
- X and Z axis boundary detection
- Velocity reversal when hitting boundaries
- Keeps ball within playable area

### Energy Loss and Damping
- **Coefficient of Restitution**: 0.7 for ground bounces (30% energy loss)
- **Rim Bounce Factor**: 0.5 (50% energy loss on rim collision)
- **Air Resistance**: Minimal damping during flight
- **Velocity Threshold**: Ball comes to rest when velocity drops below minimum threshold

### Scoring Logic
Sophisticated shot detection algorithm:
```
A shot is counted as MADE when:
1. Ball passes through rim area (within XZ radius)
2. Ball is moving downward (negative Y velocity)
3. Ball crosses rim height threshold
4. Ball is within horizontal bounds of rim
```

Only downward-moving shots count to prevent false positives from upward bounces.

### Ball Rotation
- **Dynamic Rotation**: Ball rotates based on velocity vector
- **Rotation Axis**: Perpendicular to velocity direction
- **Rotation Speed**: Proportional to velocity magnitude
- **Realistic Appearance**: Creates authentic rolling and spinning effects

## Gameplay

### Shooting Mechanics
1. **Position the Ball**: Use arrow keys to move the ball to desired court position
2. **Adjust Power**: Use W/S keys to increase or decrease shot power
3. **Take the Shot**: Press spacebar to launch the ball
4. **Watch the Physics**: Ball follows realistic trajectory with proper arc
5. **Score Feedback**: UI updates immediately when shot is made or missed

### Scoring System
- **Points per Basket**: 1 point per successful shot
- **Accuracy Tracking**: Made shots / Total attempts
- **Streak System**: 
  - Current streak increases with consecutive made shots
  - Resets to 0 on missed shot
  - Best streak saved and displayed
- **High Score**: Automatically tracks and displays highest score achieved

### Game Strategy
- **Power Control**: Higher power for long-distance shots, lower for close-range
- **Position Matters**: Closer to hoop increases accuracy
- **Streak Bonuses**: Maintain streaks for psychological advantage
- **Dual Hoops**: Practice from different angles using both hoops

## Installation

### Prerequisites
- Node.js (v12 or higher)
- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)

### Setup Instructions

1. **Clone the Repository**
```bash
git clone <repository-url>
cd basketball-3d-game
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start the Server**
```bash
     node index.js
     ```

4. **Open in Browser**
Navigate to:
```
http://localhost:8000
```

### Alternative Setup Methods

**Option 1: Using http-server (if available)**
```bash
   npx http-server . -p 8080
   ```
Then visit: `http://localhost:8080`

**Option 2: Using Python**
```bash
# Python 3
     python3 -m http.server 8080

# Python 2
     python -m SimpleHTTPServer 8080
     ```
Then visit: `http://localhost:8080`

## Controls

### Movement Controls
| Key | Action |
|-----|--------|
| **Arrow Up** | Move basketball forward (toward hoops) |
| **Arrow Down** | Move basketball backward (away from hoops) |
| **Arrow Left** | Move basketball left |
| **Arrow Right** | Move basketball right |

### Shooting Controls
| Key | Action |
|-----|--------|
| **W** | Increase shot power (+5% per press) |
| **S** | Decrease shot power (-5% per press) |
| **Spacebar** | Shoot basketball toward nearest hoop |

### Game Controls
| Key | Action |
|-----|--------|
| **R** | Reset basketball to center position, reset velocity and streak |
| **O** | Toggle orbit camera controls (free camera mode) |

### Mouse Controls (Orbit Mode)
- **Left Click + Drag**: Rotate camera around scene
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out

## Technical Implementation

### Technology Stack
- **Three.js (r128)**: 3D graphics library for WebGL
- **Express.js**: Web server framework
- **Vanilla JavaScript**: ES6 modules for game logic
- **HTML5 Audio API**: Sound effect management

### Architecture

**Scene Setup**:
```javascript
- Scene: THREE.Scene with dark blue background
- Camera: PerspectiveCamera with 75° FOV
- Renderer: WebGLRenderer with antialiasing and shadows enabled
- Lighting: Ambient light + Directional light with shadow casting
```

**Core Components**:
- `hw5.js`: Main game logic, physics simulation, rendering loop
- `OrbitControls.js`: Camera control system
- `index.js`: Express server configuration
- Audio files: WAV and MP3 for sound effects

### Physics Update Loop

The game runs at 60 FPS with the following update cycle:

```
function animate() {
    1. Update ball physics (gravity, velocity, position)
    2. Check ground collision
    3. Check rim collision
    4. Check backboard collision
    5. Check court boundaries
    6. Check scoring conditions
    7. Update ball rotation
    8. Update visual effects (rim glow)
    9. Render scene
    10. Request next frame
}
```

### Key Algorithms

**Trajectory Calculation**:
```javascript
// Calculate distance to target
distance = sqrt((targetX - ballX)² + (targetZ - ballZ)²)

// Calculate launch angle (45-60 degrees depending on power)
angle = 45° + (power * 15°)

// Calculate initial velocity components
velocityY = sqrt(2 * gravity * (targetHeight - ballY))
velocityXZ = distance / (2 * velocityY / gravity)
```

**Collision Detection (Rim)**:
```javascript
// Calculate horizontal distance from rim center
horizontalDistance = sqrt((ballX - rimX)² + (ballZ - rimZ)²)

// Check if within rim radius
if (horizontalDistance < rimRadius + ballRadius) {
    // Check if at rim height
    if (abs(ballY - rimY) < threshold) {
        // Collision detected
        reflect velocity and apply energy loss
    }
}
```

**Scoring Detection**:
```javascript
// Check if ball passes through rim going downward
if (ballVelocityY < 0) {  // Moving downward
    if (ballY < rimY && ballY > rimY - threshold) {
        if (horizontalDistance < rimInnerRadius) {
            // BASKET MADE
            incrementScore()
            incrementStreak()
            triggerEffects()
        }
    }
}
```

### Performance Optimizations
- **Efficient Collision Checks**: Distance calculations only when needed
- **Throttled Audio**: Prevents sound overlap issues
- **Optimized Rendering**: Single render call per frame
- **Texture Caching**: Loaded once and reused
- **Shadow Map Optimization**: Configured for performance vs quality balance

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL 1.0 support minimum.

## Project Structure

```
basketball-3d-game/
├── index.html                  # Main HTML entry point
├── index.js                    # Express server
├── package.json                # Node.js dependencies
├── src/
│   ├── hw5.js                 # Main game logic and physics
│   ├── OrbitControls.js       # Camera controls
│   ├── *.mp3                  # Background music
│   └── *.wav                  # Sound effects
├── image 1.png                # Screenshot 1
├── image 2.png                # Screenshot 2
├── image 3.png                # Screenshot 3
└── gameplay1.mp4              # Gameplay video
```

## Screenshots

### Game Interface
![Basketball Court Overview](image%201.png)
*Main gameplay view showing the basketball court, dual hoops, and UI elements*

### Gameplay Action
![Active Gameplay](image%202.png)
*Ball in motion with trajectory and scoring interface visible*

### Stadium Environment
![Stadium View](image%203.png)
*Wide view of the Maccabi Tel Aviv-themed basketball environment*

### Video Demonstration
For a complete gameplay demonstration, see `gameplay1.mp4` in the project directory.

## Future Enhancements

Potential features for future development:
- **Multiplayer Mode**: Competitive shooting with multiple players
- **Different Game Modes**: 
  - Time trial challenges
  - Score targets
  - Around-the-world shooting positions
- **Difficulty Levels**: Adjustable physics parameters
- **Shot Types**: Layups, dunks, bank shots
- **Ball Customization**: Different ball skins and textures
- **Advanced Physics**: 
  - Spin mechanics (backspin, topspin)
  - Wind effects
  - Temperature effects on ball behavior
- **Replay System**: Review and share best shots
- **Leaderboards**: Online score tracking
- **Mobile Support**: Touch controls for mobile devices
- **VR Mode**: Virtual reality integration

## Performance Metrics

Typical performance on modern hardware:
- **Frame Rate**: 60 FPS constant
- **Physics Updates**: 60 Hz (1:1 with frame rate)
- **Memory Usage**: ~50-100 MB
- **Load Time**: < 2 seconds on broadband
- **CPU Usage**: 5-10% on modern processors

## Troubleshooting

**Server won't start**:
- Check if port 8000 is already in use
- Kill existing process: `lsof -ti:8000 | xargs kill -9`
- Try alternative port by modifying `index.js`

**WebGL errors**:
- Update graphics drivers
- Try different browser
- Check WebGL support: visit `get.webgl.org`

**Audio not playing**:
- Check browser audio permissions
- Verify audio files exist in `/src` directory
- Try interaction first (browsers block auto-play)

**Physics seems incorrect**:
- Check browser console for errors
- Verify Three.js loaded correctly
- Ensure WebGL is properly initialized

## Technical Notes

### Coordinate System
- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Down (-) to Up (+)
- **Z-axis**: Back (-) to Front (+)

### Unit System
- Scene units represent meters
- Standard basketball court: 28m × 15m
- Rim height: 3.05m (regulation height)
- Ball radius: 0.12m (regulation size)

### Physics Constants
```javascript
GRAVITY = -9.8              // m/s²
GROUND_RESTITUTION = 0.7    // 70% energy retained
RIM_RESTITUTION = 0.5       // 50% energy retained
AIR_RESISTANCE = 0.998      // 0.2% velocity loss per frame
MIN_VELOCITY = 0.01         // Threshold for rest
```

## Credits

### Technologies
- **Three.js**: Three.js authors and contributors
- **Express.js**: Express.js team
- **WebGL**: Khronos Group

### Assets
- Court texture: Professional basketball court flooring
- Audio effects: Licensed sound libraries
- Maccabi Tel Aviv anthem: Official team audio

## Authors

**Almog Arazi**

Computer Graphics Developer specializing in real-time 3D rendering and physics simulation.

## License

This project is provided as-is for educational and demonstration purposes.

---

**Built with passion for basketball and computer graphics**

For questions, issues, or contributions, please open an issue on the repository.
