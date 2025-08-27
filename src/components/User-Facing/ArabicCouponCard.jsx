const ArabicCouponCard = ({ data }) => {
  const { title, point, image } = data;
  return (
    <div
      className="w-full rounded-2xl overflow-hidden bg-white"
      style={{
        boxShadow: `
          0px 0.5px 1.5px 0px #0000001F,
          0px 0px 1px 0px #0000000A
        `,
      }}
      dir="rtl"
    >
      <img src={image} alt={title} className="w-full h-25" />

      <div className="p-3 flex flex-col poppins-text">
        <span className="text-xs font-medium leading-tight line-clamp-2 mb-4">
          {title}
        </span>
        <span className="text-[#FCB351] text-xs font-semibold justify-self-end">
          {point} نقاط
        </span>
      </div>
    </div>
  );
};

export default ArabicCouponCard;
