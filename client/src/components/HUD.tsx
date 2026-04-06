import { ZONES } from '../config/constants';

interface HUDProps {
  x: number;
  y: number;
  onlineCount: number;
}

function getCurrentZone(x: number, y: number) {
  for (const zone of ZONES) {
    if (x >= zone.x && x <= zone.x + zone.width && y >= zone.y && y <= zone.y + zone.height) {
      return zone;
    }
  }
  return null;
}

export function HUD({ x, y, onlineCount }: HUDProps) {
  const currentZone = getCurrentZone(x, y);

  return (
    <div className="fixed top-4 left-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-lg px-3 py-2 z-10">
      <div className="text-xs text-gray-400 space-y-0.5">
        <p>
          Position: ({Math.round(x)}, {Math.round(y)})
        </p>
        <p>
          Online: <span className="text-indigo-400">{onlineCount}</span>
        </p>
        {currentZone ? (
          <p>
            Zone: <span className="text-white font-medium">{currentZone.emoji} {currentZone.name}</span>
          </p>
        ) : (
          <p>
            Zone: <span className="text-gray-500">Open Space</span>
          </p>
        )}
      </div>
    </div>
  );
}
