import {
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  StarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";

const CustomerView = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-mono font-bold text-gray-900 dark:text-white">
            {data?.customer_id}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-medium">
              <span className="text-xs font-mono">{data?.customer_id?.slice(-4)}</span>
            </div>
            <div className="ml-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                ID: {data?.customer_id}
              </div>
              {data?.tier?.name && (
                <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded">
                  {data?.tier?.name}
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center">
              <div className="flex items-center mr-4">
                <StarIcon className="w-4 h-4 text-yellow-400 dark:text-yellow-500 mr-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {data?.total_points || 0}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last active: {moment(data?.last_active)?.fromNow()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3">
                Contact
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${data?.email}`}
                  className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <EnvelopeIcon className="w-4 h-4 text-green-400 dark:text-green-500 mr-2" />
                  {data?.email}
                </a>

                <a
                  href={`tel:${data?.phone}`}
                  className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <PhoneIcon className="w-4 h-4 text-green-400 dark:text-green-500 mr-2" />
                  {data?.phone}
                </a>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                  <span>
                    Member since {moment(data?.createdAt).format("MMM D, YYYY")}
                  </span>
                </div>
              </div>
              {data?.tier?.description && (
                <div className="mt-6">
                  <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3">
                    Membership
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {data?.tier?.description?.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3">
                Applications
              </h3>

              {data?.app_type && data?.app_type?.length > 0 ? (
                <div className="space-y-4">
                  {data?.app_type?.map((app) => (
                    <div
                      key={app?._id}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CreditCardIcon className="w-4 h-4 text-green-400 dark:text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {app?.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {app?.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Last used:{" "}
                        {moment()
                          .subtract(Math.floor(Math.random() * 30), "days")
                          .fromNow()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 py-4">
                  No applications registered
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
