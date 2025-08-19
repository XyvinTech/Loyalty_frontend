const AppButton = ({ name, variant = "bronze", onClick }) => {
  const variantStyles = {
    bronze: "bg-gradient-to-r from-[#FFFBEF] to-[#FFDFBE]",
    silver: "bg-gradient-to-r from-[#E4E4E4] to-[#7C818A]",
    gold: "bg-gradient-to-r from-[#FFFBEF] to-[#FFD983]",
  };

  const backgroundClass = variantStyles[variant] || variantStyles.bronze;

  return (
    <button
      onClick={onClick}
      className={`text-xs  font-medium text-[#0F0F10] px-[10px] py-[8px] rounded-[10px] ${backgroundClass}`}
    >
      {name}
    </button>
  );
};

export default AppButton;
