import { useState } from "react";
import { Plus, Check, AlertCircle } from "lucide-react";
import { useAddToken } from "../hooks/useAddToken";

export default function AddTokenButton({ compact = false }) {
  const { addToken, status, error, isSupported } = useAddToken();
  const [shown, setShown] = useState(false);

  if (!isSupported) return null;

  const handle = async () => {
    setShown(true);
    await addToken();
    setTimeout(() => setShown(false), 4000);
  };

  if (status === "success" && shown) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-400">
        <Check className="w-3.5 h-3.5" />
        <span>SPV added to wallet</span>
      </div>
    );
  }

  if (status === "declined" && shown) {
    return (
      <div className="flex items-center gap-2 text-xs text-warm-mute">
        <span>Declined - click to try again</span>
      </div>
    );
  }

  if (error && shown) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-400">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="truncate">{error}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handle}
      disabled={status === "pending"}
      className={
        compact
          ? "text-xs text-[#00ffff] hover:text-[#ff8c00] transition-colors inline-flex items-center gap-1"
          : "glass-button text-xs inline-flex items-center gap-2"
      }
    >
      <Plus className="w-3.5 h-3.5" />
      <span>{status === "pending" ? "Adding..." : "Add SPV to wallet"}</span>
    </button>
  );
}
