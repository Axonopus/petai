"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  variant?: "spinner" | "cat";
}

export function LoadingSpinner({
  size = "md",
  color = "#FC8D68",
  className = "",
  variant = "cat",
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  if (variant === "cat") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`relative ${sizeMap[size]}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-bounce"
          >
            <path
              d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 7.58172 18 12 18C16.4183 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z"
              stroke={color}
              strokeWidth="2"
              className="animate-wiggle"
            />
            <path
              d="M8 8C8.5 8 9 8.5 9 9C9 9.5 8.5 10 8 10C7.5 10 7 9.5 7 9C7 8.5 7.5 8 8 8Z"
              fill={color}
            />
            <path
              d="M16 8C16.5 8 17 8.5 17 9C17 9.5 16.5 10 16 10C15.5 10 15 9.5 15 9C15 8.5 15.5 8 16 8Z"
              fill={color}
            />
            <path
              d="M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12Z"
              fill={color}
            />
            <path
              d="M20 10C20 14.4183 16.4183 18 12 18C7.58172 18 4 14.4183 4 10"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-tail-swish"
            />
            <path
              d="M7 6L5 4M17 6L19 4"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-ear-twitch"
            />
          </svg>
          <style jsx>{`
            @keyframes wiggle {
              0%, 100% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
            }
            @keyframes tail-swish {
              0%, 100% { transform: translateX(-1px); }
              50% { transform: translateX(1px); }
            }
            @keyframes ear-twitch {
              0%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(0.8); }
            }
            .animate-wiggle {
              animation: wiggle 2s ease-in-out infinite;
            }
            .animate-tail-swish {
              animation: tail-swish 1.5s ease-in-out infinite;
            }
            .animate-ear-twitch {
              animation: ear-twitch 3s ease-in-out infinite;
            }
          `}</style>
        </div>
        <p className="ml-2 text-gray-600 font-medium">Loading purr-fect content...</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeMap[size]}`}
        style={{ borderColor: color }}
      ></div>
    </div>
  );
}