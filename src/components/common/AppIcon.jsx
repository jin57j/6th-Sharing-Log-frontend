function AppIcon({ className = "" }) {
  return (
    <img
      src="/icons/app-icon-192.png"
      alt=""
      aria-hidden="true"
      className={`object-contain ${className}`}
    />
  );
}

export default AppIcon;
