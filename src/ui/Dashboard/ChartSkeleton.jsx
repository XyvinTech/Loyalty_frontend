const ChartSkeleton = () => {
  return (
    <div className="h-full w-full animate-pulse">
      <div className="h-full flex items-end justify-between gap-2">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className="flex-1 bg-gray-200 rounded-t"
            style={{
              height: `${Math.random() * 60 + 20}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ChartSkeleton;



