/** Scroll smoothly to a section by id */
export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Clamp a number between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Format a number with optional suffix */
export function formatStat(value, suffix) {
  return `${value}${suffix}`;
}

/** Debounce a function */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Generate CSS transition string */
export function transition(
  properties,
  duration = 0.3,
  easing = "cubic-bezier(0.4,0,0.2,1)",
  delay = 0,
) {
  const props = Array.isArray(properties) ? properties : [properties];
  return props.map((p) => `${p} ${duration}s ${easing} ${delay}s`).join(", ");
}

/** Reveal style for scroll animations */
export function revealStyle(inView, delaySeconds = 0, direction = "up") {
  const transforms = {
    up: "translateY(24px)",
    left: "translateX(-24px)",
    right: "translateX(24px)",
  };
  return {
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : transforms[direction],
    transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delaySeconds}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delaySeconds}s`,
  };
}
