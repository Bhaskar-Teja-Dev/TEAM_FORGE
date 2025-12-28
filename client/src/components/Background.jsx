import Cubes from './Cubes'

function Background() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'auto'
    }}>
      <Cubes 
        gridSize={12}
        maxAngle={60}
        radius={4}
        borderStyle="3px solid #ffffffff"
        faceColor="#000000ff"
        rippleColor="#ff0707ff"
        rippleSpeed={1.0}
        autoAnimate={true}
        rippleOnClick={true}
      />
    </div>
  )
}

export default Background

