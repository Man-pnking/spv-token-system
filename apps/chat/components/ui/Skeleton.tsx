type Props = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "full";
};

export function Skeleton({
  className = "",
  width,
  height,
  rounded = "md",
}: Props) {
  const roundedClass =
    rounded === "full" ? "rounded-full" : rounded === "sm" ? "rounded-md" : "rounded-lg";

  return (
    <div
      className={
        "bg-white/5 animate-pulse " + roundedClass + " " + className
      }
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={"space-y-2 " + className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} rounded="full" />;
}

export default Skeleton;
