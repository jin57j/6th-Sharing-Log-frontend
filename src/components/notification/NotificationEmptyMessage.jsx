function NotificationEmptyMessage({ children }) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white px-5 py-10 text-center text-sm font-bold text-gray-500 shadow-sm">
      {children}
    </div>
  );
}

export default NotificationEmptyMessage;
