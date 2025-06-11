import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function UserAvatar({
  src,
  name,
  className,
  size = "md",
}: UserAvatarProps) {
  // Get the first letter of the first name or first character of name
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={src || "/placeholder.svg"} alt={name} />
      <AvatarFallback>
        <div
          className={cn(
            "w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold",
            textSizeClasses[size]
          )}
        >
          {firstLetter}
        </div>
      </AvatarFallback>
    </Avatar>
  );
}
