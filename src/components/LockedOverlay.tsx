/**
 * LockedOverlay.tsx
 *
 * Teaser lockdown for pages outside the Command Center.
 * Content is heavily blurred to hint at what's there without giving it away.
 * A centred modal invites visitors to reach out.
 */

import { Lock } from "lucide-react";

interface LockedOverlayProps {
  children: React.ReactNode;
}

export default function LockedOverlay({ children }: LockedOverlayProps) {
  return (
    <div className="relative">
      {/* Page content — heavily blurred, not interactive */}
      <div
        className="pointer-events-none select-none"
        style={{ filter: "blur(10px)", opacity: 0.7 }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Full-viewport overlay — sits above blurred content, below sidebar */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/30 backdrop-blur-sm">
        <div
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-10 max-w-sm w-full mx-6 text-center"
          style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}
        >
          {/* Lock icon */}
          <div className="w-14 h-14 rounded-full bg-[#03440c] flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-3">
            Interested?
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Reach out to us at:
          </p>

          <a
            href="mailto:rose@flowt.africa"
            className="inline-block bg-[#03440c] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#0a5c14] transition-colors"
          >
            rose@flowt.africa
          </a>
        </div>
      </div>
    </div>
  );
}
