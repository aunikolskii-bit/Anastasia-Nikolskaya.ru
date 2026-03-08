import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
  }
}

interface Answer {
  id: string;
  label: string;
  goal: string;
}

interface Props {
  lang: 'ru' | 'en';
  question: string;
  answers: Answer[];
  thanksText: string;
  closeLabel: string;
}

type Phase = 'idle' | 'visible' | 'thanks' | 'closing' | 'done';

const METRIKA_ID = 107212716;
const SESSION_KEY = 'exit_feedback_shown';
const CONSENT_KEY = 'analytics_consent';
const ARM_DELAY_MS = 15_000;
const MOBILE_SCROLL_THRESHOLD = 0.6;
const MOBILE_IDLE_MS = 8_000;
const THANKS_DURATION_MS = 1_500;

function fireGoal(goal: string) {
  if (
    localStorage.getItem(CONSENT_KEY) === 'accepted' &&
    typeof window.ym === 'function'
  ) {
    window.ym(METRIKA_ID, 'reachGoal', goal);
  }
}

export default function ExitFeedbackIsland({
  question,
  answers,
  thanksText,
  closeLabel,
}: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const cardRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useRef(false);

  const show = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setPhase('visible');
    fireGoal('exit_feedback_shown');
  }, []);

  useEffect(() => {
    // Check reduced motion preference
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    // Consent flow must be resolved before we arm
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === null) return;

    const isMobile = window.matchMedia(
      '(hover: none) and (pointer: coarse)',
    ).matches;

    let armed = false;
    let cancelled = false;

    // Arm after minimum time-on-page gate
    const armTimer = setTimeout(() => {
      if (!cancelled) armed = true;
    }, ARM_DELAY_MS);

    // --- Desktop: mouse exit intent ---
    function handleMouseOut(e: MouseEvent) {
      if (!armed || cancelled) return;
      if (e.clientY <= 0) {
        show();
        cleanup();
      }
    }

    // --- Mobile: scroll depth + sustained idle ---
    let scrolledPastThreshold = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    function clearIdleTimer() {
      if (idleTimer !== null) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    }

    function resetIdle() {
      clearIdleTimer();
      if (scrolledPastThreshold && armed && !cancelled) {
        idleTimer = setTimeout(() => {
          if (!cancelled) {
            show();
            cleanup();
          }
        }, MOBILE_IDLE_MS);
      }
    }

    function handleScroll() {
      if (cancelled) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable >= MOBILE_SCROLL_THRESHOLD) {
        scrolledPastThreshold = true;
        resetIdle();
      }
    }

    function handleTouch() {
      if (!cancelled) resetIdle();
    }

    if (isMobile) {
      document.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('touchstart', handleTouch, { passive: true });
    } else {
      document.addEventListener('mouseout', handleMouseOut);
    }

    function cleanup() {
      cancelled = true;
      clearTimeout(armTimer);
      clearIdleTimer();
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouch);
    }

    return cleanup;
  }, [show]);

  // Handle closing transition end
  useEffect(() => {
    if (phase !== 'closing') return;
    const card = cardRef.current;
    if (!card) {
      setPhase('done');
      return;
    }
    if (prefersReducedMotion.current) {
      setPhase('done');
      return;
    }
    function onEnd() {
      setPhase('done');
    }
    card.addEventListener('transitionend', onEnd, { once: true });
    // Fallback in case transitionend doesn't fire
    const fallback = setTimeout(onEnd, 350);
    return () => {
      card.removeEventListener('transitionend', onEnd);
      clearTimeout(fallback);
    };
  }, [phase]);

  function handleAnswer(goal: string) {
    fireGoal(goal);
    setPhase('thanks');
    setTimeout(() => setPhase('closing'), THANKS_DURATION_MS);
  }

  function handleDismiss() {
    fireGoal('exit_feedback_dismissed');
    setPhase('closing');
  }

  if (phase === 'idle' || phase === 'done') return null;

  const isClosing = phase === 'closing';
  const skipAnimation = prefersReducedMotion.current;

  const closingStyle: Record<string, string> = isClosing && !skipAnimation
    ? {
        opacity: '0',
        transform: 'translateY(4px)',
        transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
      }
    : {};

  return (
    <aside
      ref={cardRef}
      aria-label={question}
      class="fixed z-30 w-[320px] max-w-[calc(100vw-32px)]"
      style={{
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        right: 'calc(16px + env(safe-area-inset-right, 0px))',
        ...closingStyle,
      }}
    >
      <div
        class={`relative bg-[var(--color-card-fill)] border border-[var(--color-border)] rounded-[16px] p-6 shadow-[0_5px_25px_rgba(105,70,113,0.12)]${skipAnimation ? '' : ' animate-fadeIn'}`}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 min-w-[44px] min-h-[44px] text-[var(--color-text-body)] opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label={closeLabel}
          type="button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>

        {phase === 'thanks' ? (
          <p
            class="text-center text-[15px] text-[var(--color-text-body)] py-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {thanksText}
          </p>
        ) : (
          <>
            <p
              class="text-[15px] font-semibold text-[var(--color-dark)] mb-4 pr-8"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {question}
            </p>
            <div class="flex flex-col gap-2">
              {answers.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleAnswer(a.goal)}
                  class="text-left text-[14px] text-[var(--color-text-body)] px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-transparent hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary-dark)] transition-colors duration-200 cursor-pointer"
                  type="button"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
