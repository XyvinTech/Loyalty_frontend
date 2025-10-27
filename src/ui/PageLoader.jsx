/**
 * PageLoader Component
 *
 * A simple full-page loading spinner
 */

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center w-full h-[70vh]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoader;

