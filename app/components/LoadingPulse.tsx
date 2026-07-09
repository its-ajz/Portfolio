'use client'

// Shown only in the gap between the intro fade finishing and Scene's WebGL
// context reporting ready — covers slower devices where the mount head
// start (triggered on click, see IntroScreen's onClickStart) doesn't close
// before the fade-out ends. Disappears the instant onReady fires.
export default function LoadingPulse({ ready }: { ready: boolean }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: ready ? 0 : 1,
      transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: '10px', height: '10px', borderRadius: '50%',
        background: '#00E5FF',
        animation: 'loadingPulseBreathe 1.6s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes loadingPulseBreathe {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
