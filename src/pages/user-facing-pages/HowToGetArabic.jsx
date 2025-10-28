import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";

const HowtoGetArabic = ({link}) => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8 font-sans rtl"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 flex-row-reverse justify-end">
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              كيفية كسب النقاط
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              اكتشف جميع الطرق التي يمكنك من خلالها كسب نقاط المكافآت من خلال
              خدمات خدمة واحصل على المزايا الحصرية
            </p>
          </div>
        </div>

        {/* Tier Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center flex-row-reverse">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center ml-3">
              <span className="text-white font-bold text-sm">★</span>
            </div>
            مزايا المستويات
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Bronze Tier */}
            <div
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{
                backgroundColor: "#DF9872",
                borderColor: "#DF9872",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                // style={{
                //   background:
                //     "linear-gradient(270deg, #FBC07F, #FFF9F3, #F9B97C, #A75D32)",
                // }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background:
                        "linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)",
                    }}
                  >
                    <span className="text-white font-bold text-xl drop-shadow">
                      ب
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background:
                        "linear-gradient(90deg, #F7CAA6, #FFFFFF, #A16133)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    برونزي
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#784019" }}
                  >
                    المستوى الأول (افتراضي)
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      مضاعف النقاط
                    </div>
                    <div className="font-bold" style={{ color: "#A16133" }}>
                      ×1 النقاط المكتسبة
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      صلاحية النقاط
                    </div>
                    <div style={{ color: "#784019" }}>45 يوم</div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      العروض
                    </div>
                    <div className="text-sm" style={{ color: "#784019" }}>
                      مجموعة عروض قياسية - عروض يومية على الأساسيات والمطاعم
                      والتجزئة
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{
                backgroundColor: "#C0C0C0",
                borderColor: "#C0C0C0",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: "linear-gradient(270deg, #090909, #6F6F6F)",
                }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background: "linear-gradient(90deg, #D8D8D8, #FFFFFF)",
                    }}
                  >
                    <span
                      className="font-bold text-xl"
                      style={{ color: "#0E0E0E" }}
                    >
                      ف
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background: "linear-gradient(90deg, #D8D8D8, #FFFFFF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    فضي
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#0E0E0E" }}
                  >
                    حد أدنى 100 نقطة مكتسبة كل شهر لمدة ثلاثة أشهر متتالية
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#434343" }}
                  >
                    <div className="text-sm font-medium text-white">
                      مضاعف النقاط
                    </div>
                    <div className="font-bold text-white">
                      × 1.1 النقاط المكتسبة
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#434343" }}
                  >
                    <div className="text-sm font-medium text-white">
                      صلاحية النقاط
                    </div>
                    <div className="text-white">60 يوم</div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#434343" }}
                  >
                    <div className="text-sm font-medium text-white">العروض</div>
                    <div className="text-sm text-white">
                      مجموعة موسعة من العروض عبر الفئات - عروض أوسع تشمل أسلوب
                      الحياة والسفر والترفيه
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div
              className="rounded-xl p-6 border-2 relative overflow-hidden"
              style={{
                backgroundColor: "#FFD700",
                borderColor: "#FFD700",
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "linear-gradient(270deg, #FFF08B, #FED500, #FFE289, #FDCD01, #FFC100)",
                }}
              ></div>
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{
                      background:
                        "linear-gradient(90deg, #FBC000, #FFFFFF, #FFDD00)",
                    }}
                  >
                    <span
                      className="font-bold text-xl"
                      style={{ color: "#784019" }}
                    >
                      ذ
                    </span>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{
                      background:
                        "linear-gradient(90deg, #FBC000, #FFFFFF, #FFDD00)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ذهبي
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#784019" }}
                  >
                    حد أدنى 150 نقطة مكتسبة كل شهر لمدة ثلاثة أشهر متتالية
                  </p>
                </div>

                <div className="space-y-3">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      مضاعف النقاط
                    </div>
                    <div className="font-bold" style={{ color: "#FBC000" }}>
                      ×1.25 النقاط المكتسبة
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      صلاحية النقاط
                    </div>
                    <div style={{ color: "#784019" }}>90 يوم</div>
                  </div>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#FFDDBD" }}
                  >
                    <div
                      className="text-sm font-medium"
                      style={{ color: "#784019" }}
                    >
                      العروض
                    </div>
                    <div className="text-sm" style={{ color: "#784019" }}>
                      الحد الأقصى من العروض بما في ذلك العروض المميزة والحصرية -
                      عروض مميزة من أفضل العلامات التجارية (المنتجات الفاخرة،
                      سفر، إلكترونيات، صحة، مطاعم فاخرة)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Point Earning Criteria - Khedmah App */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center flex-row-reverse">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-3">
              <span className="text-white font-bold text-sm">خ</span>
            </div>
            تطبيق خدمة
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Bills Payment */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                دفع فاتورة الكهرباء، دفع فاتورة المياه، دفع فاتورة الاتصالات
                (آجل)، المدفوعات لشرطة عمان السلطانية، إشتراكات صندوق الحماية
                الاجتماعية
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-200 flex-row-reverse">
                  <span className="font-medium text-gray-700">
                    النقاط المكتسبة:
                  </span>
                  <span className="text-blue-600 font-bold">35 نقطة</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200 flex-row-reverse">
                  <span className="font-medium text-gray-700">
                    الحد الأدنى للمعاملة:
                  </span>
                  <span className="text-gray-600">
                    قيمة معاملة لا تقل عن &gt; 3.000 ريال عماني
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 flex-row-reverse">
                  <span className="font-medium text-gray-700">
                    عدد المعاملات:
                  </span>
                  <span className="text-gray-600">
                    لا يزيد عن معاملة واحدة لكل حساب في الشهر
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  أنواع الخدمات تشمل:
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>1. نماء للكهرباء</span>
                  <span>2. نماء للمياه</span>
                  <span>3. عمانتل آجل الدفع</span>
                  <span>4. أوريدو آجل الدفع</span>
                  <span>5. أواصر</span>
                  <span>6. شرطة عمان السلطانية</span>
                  <span>7. فودافون آجل الدفع</span>
                  <span>8. صندوق الحماية الاجتماعية</span>
                  <span>9. أوان للغاز</span>
                </div>
              </div>
            </div>

            {/* Telecom Recharge */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إعادة شحن الكهرباء مسبقة الدفع وشراء القسائم والتأمين
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-green-200 flex-row-reverse">
                  <span className="font-medium text-gray-700">
                    النقاط المكتسبة:
                  </span>
                  <span className="text-green-600 font-bold">
                    2% من قيمة المعاملة
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200 flex-row-reverse">
                  <span className="font-medium text-gray-700">
                    الحد الأدنى للمعاملة:
                  </span>
                  <span className="text-gray-600">
                    قيمة معاملة لا تقل عن &gt; 1.000 ريال عماني
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  أنواع الخدمات تشمل:
                </h4>
                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                  <span>1. إعادة شحن عمانتل</span>
                  <span>2. اعادة شحن أوريدو</span>
                  <span>3. إعادة شحن فودافون</span>
                  <span>4. إعادة شحن فريندي</span>
                  <span>5. إعادة شحن رنة</span>
                  <span>6. إعادة شحن ريدبول</span>
                  <span>7. المتجر الإلكتروني</span>
                  <span>8. التأمين</span>
                  <span>9. إعادة شحن دولي</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khedmah Delivery App Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center flex-row-reverse">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center ml-3">
              <span className="text-white font-bold text-sm">ت</span>
            </div>
            تطبيق خدمة للتوصيل
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Order Delivered */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                تم تسليم الطلب
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg border-l-0 border-r-4 border-orange-400">
                  <div className="font-medium text-gray-800">
                    الطلب الأول لأي عميل
                  </div>
                  <div className="text-orange-600 font-bold">
                    2% من قيمة الطلب
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border-l-0 border-r-4 border-gray-400">
                  <div className="font-medium text-gray-800">
                    من الطلب الثاني فصاعداً للعميل العادي
                  </div>
                  <div className="text-gray-600 font-bold">
                    1% من قيمة الطلب
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border-l-0 border-r-4 border-purple-400">
                  <div className="font-medium text-gray-800">
                    من الطلب الثاني فصاعداً للمشترك الماسي
                  </div>
                  <div className="text-purple-600 font-bold">
                    2% من قيمة الطلب
                  </div>
                </div>
              </div>
            </div>

            {/* Diamond Subscription */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                الاشتراك الماسي
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="font-medium text-gray-700">
                      اشتراك شهري
                    </span>
                    <span className="text-purple-600 font-bold">50 نقطة</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="font-medium text-gray-700">
                      اشتراك سنوي
                    </span>
                    <span className="text-purple-600 font-bold">300 نقطة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Top-up */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إعادة شحن المحفظة (حد أدنى 10 ريالات عمانية)
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="font-medium text-gray-800 mb-2">
                    إعادة شحن
                  </div>
                  <div className="text-teal-600 font-bold text-lg">
                    1% من قيمة الشحن
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">
            💡 نصائح احترافية لتحقيق أقصى استفادة من نقاطك
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">1</span>
              </div>
              <p>
                اشترك في العضوية الماسية لكسب 2% على جميع طلبات التوصيل بعد
                الطلب الأول
              </p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">2</span>
              </div>
              <p>
                احصل على الحد الأدنى 100 نقطة كل شهر لمدة 3 أشهر متتالية للوصول
                إلى المستوى الفضي
              </p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">3</span>
              </div>
              <p>
                استخدم خدمات إعادة شحن الاتصالات بانتظام لكسب 2% من قيمة
                المعاملة
              </p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm">4</span>
              </div>
              <p>
                حافظ على الحد الأدنى من المعاملات 3.000 ريال عماني لدفع الفواتير
                لكسب 35 نقطة
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
             onClick={() => navigate(link ? "/terms-and-conditions/ar" : "/user/terms-and-conditions/ar")}
          >
            الشروط والأحكام
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowtoGetArabic;