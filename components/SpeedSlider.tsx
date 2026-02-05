
import React from 'react';

interface SpeedSliderProps {
  value: number;
  onChange: (val: number) => void;
  disabled: boolean;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({ value, onChange, disabled }) => {
  const getLabel = (val: number) => {
    if (val < 30) return "Poupança (Eco)";
    if (val < 70) return "Equilibrado";
    return "Kuduro Mode (Full)";
  };

  return (
    <div className={`glass p-5 rounded-3xl border border-white/5 transition-opacity ${disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Controle de Fluxo</h4>
          <p className="text-xs font-bold text-white">{getLabel(value)}</p>
        </div>
        <div className="text-right">
          <span className="jetbrains-mono text-sm font-black text-red-500">{value}%</span>
        </div>
      </div>
      
      <div className="relative flex items-center group">
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          style={{
            background: `linear-gradient(to right, #dc2626 0%, #eab308 ${value}%, #1f2937 ${value}%, #1f2937 100%)`
          }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-[8px] font-black text-gray-500 uppercase tracking-tighter">
        <span>2 Mbps</span>
        <span>Limite de Banda</span>
        <span>Max Speed</span>
      </div>
    </div>
  );
};

export default SpeedSlider;
