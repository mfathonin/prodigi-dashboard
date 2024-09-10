export const ErrorWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-red-300 dark:bg-red-400 bg-opacity-70 border-red-600 dark:border-red-200 border text-sm text-center py-3 px-3 rounded-md">
      {children}
    </div>
  );
};
