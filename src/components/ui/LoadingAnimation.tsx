import { useTheme } from "../../hooks/useTheme";

type LoadingAnimationProps = {
  label?: string;
  overlay?: boolean;
  className?: string;
};

const OLD_MAN_LIGHT = "/icons/loading/old-man_light.gif";
const OLD_MAN_DARK = "/icons/loading/old-man_dark.gif";

const LoadingAnimation = ({
  label = "Loading...",
  overlay = false,
  className = "",
}: LoadingAnimationProps) => {
  const { theme } = useTheme();
  const src = theme === "dark" ? OLD_MAN_DARK : OLD_MAN_LIGHT;

  return (
    <div
      className={`flex items-center justify-center ${overlay ? "absolute inset-0 z-30 bg-base-100/55 backdrop-blur-[2px]" : "w-full py-10"} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-base-100/20 px-6 py-5 text-center">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          onContextMenu={(event) => event.preventDefault()}
          className="h-24 w-24 sm:h-28 sm:w-28 object-contain"
        />
        {label && (
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1d4ed8] dark:text-white">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;
