import { useEffect, useCallback } from "react";

export const useKeyboardShortcuts = ({
  onSpaceBar,
  onLeftArrow,
  onRightArrow,
  onI,
  onO,
}) => {
  const handleKeyPress = useCallback(
    (event) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.code) {
        case "Space":
          event.preventDefault();
          onSpaceBar?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onLeftArrow?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          onRightArrow?.();
          break;
        case "KeyI":
          event.preventDefault();
          onI?.();
          break;
        case "KeyO":
          event.preventDefault();
          onO?.();
          break;
        default:
          break;
      }
    },
    [onSpaceBar, onLeftArrow, onRightArrow, onI, onO]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
};
