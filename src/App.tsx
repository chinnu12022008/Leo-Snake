import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black text-[#00FFFF] font-mono uppercase border-[8px] border-[#FF00FF] selection:bg-[#FF00FF] selection:text-black">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 h-[15px] bg-[#00FFFF]/20 z-50 animate-[scanline_8s_linear_infinite] opacity-50 mix-blend-overlay" />
      <div className="pointer-events-none fixed inset-0 bg-black/10 z-40" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[300px] bg-black border-r-[4px] border-[#00FFFF] p-6 hidden md:flex flex-col shrink-0 relative">
          <h2 className="text-2xl font-black mb-8 glitch-text tracking-widest text-[#FF00FF]" data-text="AURAL_LINK">AURAL_LINK</h2>
          
          <div className="p-3 mb-4 border-[2px] border-[#00FFFF] bg-[#FF00FF] text-black">
            <div className="font-bold text-[16px]">SYS_ALPHA_01</div>
            <div className="text-[12px]">SYNC_RATE: 100%</div>
          </div>
          <div className="p-3 mb-4 border-[2px] border-[#333] hover:border-[#FF00FF] cursor-crosshair">
            <div className="font-bold text-[16px]">DEEP_GROOVE</div>
            <div className="text-[12px] text-[#FF00FF]">AWAITING...</div>
          </div>
          <div className="p-3 mb-4 border-[2px] border-[#333] hover:border-[#FF00FF] cursor-crosshair">
            <div className="font-bold text-[16px]">CYBER_HARM</div>
            <div className="text-[12px] text-[#FF00FF]">AWAITING...</div>
          </div>
          
          <div className="mt-auto p-4 border-[2px] border-dashed border-[#FF00FF] bg-black animate-pulse">
            <span className="text-[#00FFFF] font-bold">ERR_CODE_0x0A:</span><br/>
            AVOID WALL COLLISION.<br/>
            CONSUME DATA BLOCKS.
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center bg-black relative p-4">
          <div className="absolute top-8 w-full text-center z-0">
             <h1 className="text-4xl md:text-5xl font-black text-[#00FFFF] tracking-[8px] opacity-20" style={{ transform: 'scaleY(2)' }}>
               SNAKE_OS.EXE
             </h1>
          </div>
          <div className="flex flex-col items-center justify-center w-full z-10 mt-12">
            <SnakeGame />
          </div>
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
}
