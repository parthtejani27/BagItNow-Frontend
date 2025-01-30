import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../store/slices/orderSlice";
import { Package, Calendar, MapPin, ChevronRight, Clock } from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    pending: {
      bg: "bg-yellow-50 dark:bg-yellow-900/30",
      text: "text-yellow-700 dark:text-yellow-400",
    },
    processing: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
    },
    delivered: {
      bg: "bg-green-50 dark:bg-green-900/30",
      text: "text-green-700 dark:text-green-400",
    },
    cancelled: {
      bg: "bg-red-50 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
    },
  };

  const style = styles[status.toLowerCase()] || styles.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      ${style.bg} ${style.text}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userOrders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-theme-secondary">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-theme-primary">
            Your Orders
          </h1>
          <p className="text-theme-tertiary mt-1">
            {userOrders.length} {userOrders.length === 1 ? "order" : "orders"}{" "}
            placed
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-success border-t-transparent" />
          </div>
        ) : userOrders.length === 0 ? (
          <div className="min-h-[400px] bg-theme-primary rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-theme-secondary/30 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-theme-tertiary" />
            </div>
            <h3 className="text-xl font-medium text-theme-primary mb-2">
              No Orders Yet
            </h3>
            <p className="text-theme-tertiary max-w-md">
              When you place orders, they will appear here for you to track and
              review.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {userOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(order._id)}
                className="bg-theme-primary rounded-xl p-6 hover:shadow-lg transition-all
                  cursor-pointer border border-theme-secondary hover:border-accent-success group"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 bg-theme-secondary/30 rounded-xl 
                      flex items-center justify-center group-hover:bg-accent-success/10"
                    >
                      <Package className="w-6 h-6 text-theme-tertiary group-hover:text-accent-success" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-theme-primary">
                          Order #{order._id.slice(-6)}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-theme-tertiary">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium text-theme-primary">
                      ${order.amounts.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Content */}
                <div className="flex justify-between items-center">
                  {/* Items Preview */}
                  <div className="flex justify-between items-center">
                    {/* Items Preview */}
                    <div className="flex items-center space-x-6">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 rounded-lg border-2 border-theme-primary
          bg-theme-secondary overflow-hidden"
                          >
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-theme-primary
          bg-theme-secondary flex items-center justify-center"
                          >
                            <span className="text-sm font-medium text-theme-tertiary">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-theme-primary font-medium">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </span>
                        <div className="flex items-center text-sm text-theme-tertiary mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {order.address.city}, {order.address.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="flex items-center text-theme-tertiary group-hover:text-accent-success">
                    View Details
                    <ChevronRight
                      className="w-5 h-5 ml-2 transform transition-transform
                      group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
