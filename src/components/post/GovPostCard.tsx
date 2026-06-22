import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

const ACTION_ICONS = {
  bookmark: {
    light: "/icons/post-actions/bookmark_light.gif",
    dark: "/icons/post-actions/bookmark_dark.gif",
  },
  share: {
    light: "/icons/post-actions/share_light.gif",
    dark: "/icons/post-actions/share_dark.gif",
  },
  comment: {
    light: "/icons/post-actions/comment_light.gif",
    dark: "/icons/post-actions/comment_dark.gif",
  },
} as const;

function ActionGif({ name }: { name: keyof typeof ACTION_ICONS }) {
  const { theme } = useTheme();
  const src = ACTION_ICONS[name][theme === "dark" ? "dark" : "light"];

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      onContextMenu={(event) => event.preventDefault()}
      className="h-8 w-8 pointer-events-none shrink-0 object-contain"
    />
  );
}

type GovPostCardProps = {
  department: string;
  title: string;
  description: string;
  time?: string;
};

const GovPostCard = ({
  department,
  title,
  description,
  time = "1h ago",
}: GovPostCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-info/30 bg-info/5 p-4"
     >
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 text-sm text-info">
        <BadgeCheck size={18} />
        <span className="font-semibold">{department}</span>
        <span className="opacity-60">• {time}</span>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-base font-semibold text-base-content">
        {title}
      </h2>

      {/* Description */}
      <p className="mb-3 text-sm opacity-80">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm opacity-80">
        <button className="flex items-center gap-1 hover:opacity-100">
          <ActionGif name="bookmark" />
          Save
        </button>

        <button className="flex items-center gap-1 hover:opacity-100">
          <ActionGif name="comment" />
          256
        </button>

        <button className="ml-auto flex items-center gap-1 hover:opacity-100">
          <ActionGif name="share" />
          Share
        </button>
      </div>
    </motion.div>
  );
};

export default GovPostCard;
