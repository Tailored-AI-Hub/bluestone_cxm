import { createContext, useContext, useState, useCallback } from "react";

const TooltipContext = createContext(null);

export function TooltipProvider({ children }) {
  const [tip, setTip] = useState(null);

  const showTip = useCallback((e, text) => {
    setTip({ x: e.clientX, y: e.clientY, text });
  }, []);
  const hideTip = useCallback(() => setTip(null), []);

  return (
    <TooltipContext.Provider value={{ showTip, hideTip }}>
      {children}
      {tip && (
        <div
          style={{
            position: "fixed",
            left: tip.x + 14,
            top: tip.y + 14,
            zIndex: 60,
            background: "#1d2d3d",
            color: "#fff",
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 500,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 6px 18px rgba(0,0,0,.28)",
            borderRadius: 6,
          }}
        >
          {tip.text}
        </div>
      )}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  return useContext(TooltipContext);
}
