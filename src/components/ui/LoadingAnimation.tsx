type LoadingAnimationProps = {
  label?: string;
  overlay?: boolean;
  className?: string;
};

const BAR_COUNT = 15;
const BAR_DELAYS = [1.4, 1.2, 1, 0.8, 0.6, 0.4, 0.2, 0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4];

const LoadingAnimation = ({
  label = "Loading...",
  overlay = false,
  className = "",
}: LoadingAnimationProps) => {
  return (
    <div
      className={`flex items-center justify-center ${overlay ? "absolute inset-0 z-30 bg-base-100/55 backdrop-blur-[2px]" : "w-full py-10"} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-base-100/20 px-6 py-5 text-center">
        <div className="govlyx-bar-loader" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, index) => (
            <span
              key={index}
              style={{ animationDelay: `${BAR_DELAYS[index]}s` }}
            />
          ))}
        </div>
        {label && (
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#1D4ED8] dark:text-white">
            {label}
          </span>
        )}
      </div>
      <style>{`
        .govlyx-bar-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 175px;
          height: 100px;
        }

        .govlyx-bar-loader span {
          display: block;
          width: 7px;
          height: 10%;
          margin-right: 5px;
          margin-top: 25%;
          border-radius: 14px;
          background: #1D4ED8;
          animation: govlyx-loader-bars 2.5s infinite linear;
        }

        .govlyx-bar-loader span:last-child {
          margin-right: 0;
        }

        @keyframes govlyx-loader-bars {
          0% {
            background: #1D4ED8;
            height: 10%;
            margin-top: 25%;
          }
          50% {
            background: #1D4ED8;
            height: 100%;
            margin-top: 0;
          }
          100% {
            background: #1D4ED8;
            height: 10%;
            margin-top: 25%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
