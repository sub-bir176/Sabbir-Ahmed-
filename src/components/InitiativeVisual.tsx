import { motion } from 'motion/react';

interface InitiativeVisualProps {
  type: 'workflow' | 'impact' | 'pipeline' | 'retail';
  className?: string;
}

const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;

export function InitiativeVisual({ type, className = '' }: InitiativeVisualProps) {
  if (type === 'workflow') {
    return (
      <div
        className={`relative w-full h-full bg-[#0F172A] text-white flex items-center justify-center p-6 overflow-hidden ${className}`}
      >
        <svg
          viewBox="0 0 480 220"
          className="w-full h-full max-w-[440px]"
          fill="none"
          aria-hidden="true"
        >
          {/* Subtle grid */}
          <path
            d="M0 55H480M0 110H480M0 165H480M120 0V220M240 0V220M360 0V220"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Base connectors */}
          <path
            d="M128 110H184M296 110H352"
            stroke="rgba(56,189,248,0.22)"
            strokeWidth="2"
          />

          {/* Smooth one-way connector draw 1 -> 2 */}
          <motion.path
            d="M128 110H184"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.15, ease: EASE_SMOOTH }}
          />

          {/* Smooth one-way connector draw 2 -> 3 */}
          <motion.path
            d="M296 110H352"
            stroke="#22D3EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0.4 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.45, ease: EASE_SMOOTH }}
          />

          {/* Node 1 */}
          <motion.g
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          >
            <rect
              x="24"
              y="78"
              width="104"
              height="64"
              rx="10"
              fill="#1E293B"
              stroke="rgba(255,255,255,0.18)"
            />
            <text x="40" y="105" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
              01 INPUT
            </text>
            <text x="40" y="124" fill="#F8FAFC" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              Lead / Data
            </text>
          </motion.g>

          {/* Node 2 */}
          <motion.g
            style={{ transformOrigin: '240px 110px' }}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE_SMOOTH }}
          >
            <rect
              x="179"
              y="67"
              width="122"
              height="86"
              rx="13"
              stroke="#60A5FA"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
            <rect
              x="184"
              y="72"
              width="112"
              height="76"
              rx="10"
              fill="#2563EB"
            />
            <text x="200" y="102" fill="#DBEAFE" fontSize="10" fontFamily="JetBrains Mono, monospace">
              02 AUTOMATE
            </text>
            <text x="200" y="122" fill="#FFFFFF" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              n8n / Zapier
            </text>
          </motion.g>

          {/* Node 3 */}
          <motion.g
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.55, ease: EASE_SMOOTH }}
          >
            <rect
              x="352"
              y="78"
              width="104"
              height="64"
              rx="10"
              fill="#1E293B"
              stroke="rgba(34,211,238,0.35)"
            />
            <text x="368" y="105" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
              03 OUTPUT
            </text>
            <text x="368" y="124" fill="#F8FAFC" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              KPI Report
            </text>
          </motion.g>
        </svg>
      </div>
    );
  }

  if (type === 'pipeline') {
    return (
      <div
        className={`relative w-full h-full bg-[#09132B] text-white flex items-center justify-center p-6 overflow-hidden ${className}`}
      >
        <svg
          viewBox="0 0 360 220"
          className="w-full h-full max-w-[336px]"
          fill="none"
          aria-hidden="true"
        >
          <motion.g
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            <rect x="18" y="34" width="324" height="38" rx="8" fill="rgba(6, 182, 212, 0.1)" stroke="rgba(34, 211, 238, 0.35)" />
            <text x="36" y="57" fill="#67E8F9" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              STAGE 01
            </text>
            <text x="104" y="57" fill="#F8FAFC" fontSize="11.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              Inbound Facebook Inquiry
            </text>
          </motion.g>

          <motion.path
            d="M180 72V90"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: 0.2, ease: EASE_SMOOTH }}
          />

          <motion.g
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.28, ease: EASE_SMOOTH }}
          >
            <rect x="28" y="90" width="304" height="38" rx="8" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(96, 165, 250, 0.4)" />
            <text x="46" y="113" fill="#93C5FD" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              STAGE 02
            </text>
            <text x="114" y="113" fill="#F8FAFC" fontSize="11.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              Tailored Student Advisory
            </text>
          </motion.g>

          <motion.path
            d="M180 128V146"
            stroke="#22D3EE"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: 0.48, ease: EASE_SMOOTH }}
          />

          <motion.g
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.56, ease: EASE_SMOOTH }}
          >
            <rect x="38" y="146" width="284" height="38" rx="8" fill="rgba(37, 99, 235, 0.35)" stroke="#22D3EE" strokeOpacity="0.65" />
            <text x="56" y="169" fill="#A5F3FC" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
              STAGE 03
            </text>
            <text x="124" y="169" fill="#FFFFFF" fontSize="11.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              Enrollment &amp; Onboarding
            </text>
          </motion.g>
        </svg>
      </div>
    );
  }

  if (type === 'impact') {
    return (
      <div
        className={`relative w-full h-full bg-[#081526] text-white flex items-center justify-center p-6 overflow-hidden ${className}`}
      >
        <svg
          viewBox="0 0 360 220"
          className="w-full h-full max-w-[320px]"
          fill="none"
          aria-hidden="true"
        >
          <motion.circle
            cx="155"
            cy="110"
            r="76"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            style={{ transformOrigin: '155px 110px' }}
            initial={{ scale: 0.88, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: EASE_SMOOTH }}
          />
          <motion.circle
            cx="155"
            cy="110"
            r="56"
            stroke="rgba(56,189,248,0.5)"
            strokeWidth="1.5"
            style={{ transformOrigin: '155px 110px' }}
            initial={{ scale: 0.82, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.15, ease: EASE_SMOOTH }}
          />
          <path
            d="M133 76C133 68 177 68 177 76V154C177 162 133 162 133 154V76Z"
            stroke="#F8FAFC"
            strokeWidth="2"
            fill="#27272A"
          />
          <path d="M139 66H171V76H139V66Z" fill="#3B82F6" />
          <path d="M133 104H177M133 130H177" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <motion.g
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE_SMOOTH }}
          >
            <text x="210" y="98" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
              KHULNA COASTAL
            </text>
            <text x="210" y="116" fill="#F8FAFC" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
              Root &amp; Reed
            </text>
          </motion.g>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full bg-[#09132B] text-white flex items-center justify-center p-6 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 480 220"
        className="w-full h-full max-w-[440px]"
        fill="none"
        aria-hidden="true"
      >
        <rect x="28" y="34" width="200" height="152" rx="12" fill="rgba(6, 182, 212, 0.1)" stroke="rgba(34, 211, 238, 0.35)" />
        <text x="48" y="64" fill="#22D3EE" fontSize="10" fontFamily="JetBrains Mono, monospace">
          TWELVE CLOTHING LTD.
        </text>
        <text x="48" y="92" fill="#F8FAFC" fontSize="16" fontWeight="600" fontFamily="Bricolage Grotesque, sans-serif">
          Sales Executive
        </text>
        <text x="48" y="118" fill="#CBD5E1" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">
          Consultative Floor Advisory
        </text>
        <text x="48" y="138" fill="#CBD5E1" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">
          Merchandising &amp; Stock Standards
        </text>
        <rect x="48" y="150" width="150" height="3" rx="1.5" fill="rgba(148, 163, 184, 0.25)" />
        <motion.rect
          x="48"
          y="150"
          height="3"
          rx="1.5"
          fill="#22D3EE"
          initial={{ width: 0 }}
          whileInView={{ width: 132 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, delay: 0.15, ease: EASE_SMOOTH }}
        />
        <text x="48" y="170" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
          AUG 2025 – DEC 2025
        </text>

        <rect x="252" y="34" width="200" height="152" rx="12" fill="rgba(99, 102, 241, 0.14)" stroke="rgba(129, 140, 248, 0.4)" />
        <text x="272" y="64" fill="#93C5FD" fontSize="10" fontFamily="JetBrains Mono, monospace">
          PIZZABURG
        </text>
        <text x="272" y="92" fill="#FFFFFF" fontSize="16" fontWeight="600" fontFamily="Bricolage Grotesque, sans-serif">
          Peer Leader
        </text>
        <text x="272" y="118" fill="#CBD5E1" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">
          High-Volume Shift Coordination
        </text>
        <text x="272" y="138" fill="#CBD5E1" fontSize="11" fontFamily="Plus Jakarta Sans, sans-serif">
          Conflict Resolution &amp; Upselling
        </text>
        <rect x="272" y="150" width="150" height="3" rx="1.5" fill="rgba(148, 163, 184, 0.25)" />
        <motion.rect
          x="272"
          y="150"
          height="3"
          rx="1.5"
          fill="#60A5FA"
          initial={{ width: 0 }}
          whileInView={{ width: 140 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, delay: 0.3, ease: EASE_SMOOTH }}
        />
        <text x="272" y="170" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
          FEB 2025 – JUNE 2025
        </text>
      </svg>
    </div>
  );
}
