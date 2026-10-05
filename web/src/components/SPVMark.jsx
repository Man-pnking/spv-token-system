export default function SPVMark({ size = 36, className = "" }) {
  return (
    <img
      src="/ruby-diamond-32.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}