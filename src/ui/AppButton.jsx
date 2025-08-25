const AppButton = ({ name, variant = "bronze", onClick }) => {
  const variantStyles = {
    bronze: {
      className: "",
      style: {
        background:
          "linear-gradient(147.07deg, #F5CBAB 30.55%, #CC8B63 50.23%, #D7966E 61.6%, #E3AE8B 68.7%, #FADEC7 83.2%)",
      },
    },
    silver: {
      className: "",
      style: {
        background:
          "conic-gradient(from 90deg at 50% 50%, #7C818A 0deg, #B6B6B6 88.27deg, #E4E4E4 245.77deg, #7C818A 360deg)",
      },
    },
    gold: {
      className: "",
      style: {
        background:
          "conic-gradient(from 76.03deg at 57.54% 60.56%, #EDC752 0deg, #FBD04C 98.65deg, #FBD357 164.42deg, #FFFFFF 245.77deg, #EDC752 360deg)",
      },
    },
  };

  const { className, style } = variantStyles[variant] || variantStyles.bronze;

  return (
    <button
      onClick={onClick}
      style={style}
      className={`flex items-center gap-2 text-xs font-medium text-[#0F0F10] px-[10px] py-[8px] rounded-[10px] ${className}`}
    >
      {name}
    </button>
  );
};

export default AppButton;
