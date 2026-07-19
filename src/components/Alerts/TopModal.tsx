import { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function TopModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return createPortal(
    <div
      className="modalOverlay"
      onMouseDown={(e) => {
        // close when clicking outside the modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modalCard" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body
  );
}
