import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Package, Calendar, MapPin, ArrowLeft, Clock } from "lucide-react";
import {
  fetchOrderDetails,
  selectOrderDetails,
  selectOrderLoading,
  selectOrderError,
} from "../../store/slices/orderSlice";
import { Printer } from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector(selectOrderDetails);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-theme-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theme-secondary p-6">
        <div className="bg-red-100 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const estimatedDelivery = new Date(
    order.delivery.estimatedDeliveryTime
  ).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const getOrderStatus = (status) => {
    const styles = {
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      processing: "bg-blue-50 text-blue-700 border-blue-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-theme-secondary">
      <div className="container-custom py-8">
        {/* Add Back Button */}
        <button
          onClick={() => navigate("..")}
          className="flex items-center text-theme-tertiary hover:text-theme-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>
        {/* Header Section */}
        <div className="bg-theme-primary p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-medium text-theme-primary">
                  Order Details
                </h1>
                <span
                  className={`px-3 py-1 text-sm rounded-full border ${getOrderStatus(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-theme-secondary">
                Order #{order._id.slice(-6)} • Placed on {orderDate}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button className="inline-flex items-center text-theme-primary hover:text-black transition-colors">
                <Printer className="w-4 h-4 mr-2" />
                Print Order
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-theme-primary p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-theme-secondary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-medium text-theme-primary mb-1">
                    Delivery Details
                  </h2>
                  <p className="text-theme-secondary">
                    Estimated delivery: {estimatedDelivery}
                  </p>
                  {order.delivery.instructions && (
                    <p className="text-theme-secondary mt-2">
                      Instructions: {order.delivery.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-theme-primary rounded-lg shadow-sm">
              <div className="p-6 border-b border-theme-secondary">
                <h2 className="text-lg font-medium text-theme-primary">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "Item" : "Items"}
                </h2>
              </div>

              <div className="divide-y divide-theme-secondary">
                {order.items.map((item) => (
                  <div key={item._id} className="p-6 flex gap-6">
                    <div className="w-24 h-24 bg-theme-secondary rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={item.product.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-theme-primary">
                        {item.name}
                      </h3>
                      <div className="mt-2 text-sm text-theme-secondary">
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-theme-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Address */}
            <div className="bg-theme-primary p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-theme-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-theme-primary mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-theme-secondary">
                    {order.address.streetNumber} {order.address.streetName}
                    <br />
                    {order.address.city}, {order.address.state}
                    <br />
                    {order.address.zipcode}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-theme-primary p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-theme-primary mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-theme-secondary">
                  <span>Subtotal</span>
                  <span>${order.amounts.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-theme-secondary">
                  <span>Delivery</span>
                  <span>${order.amounts.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-theme-secondary">
                  <span>Tax</span>
                  <span>${order.amounts.tax.toFixed(2)}</span>
                </div>
                {order.amounts.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.amounts.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-theme-secondary">
                  <div className="flex justify-between text-lg font-medium text-theme-primary">
                    <span>Total</span>
                    <span>${order.amounts.total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-theme-secondary mt-2">
                    Paid with {order.payment.method}
                    {order.payment.method === "card" &&
                      ` •••• ${order.payment.paymentMethodId.slice(-4)}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Support Options */}
            <div className="bg-theme-primary p-6 rounded-lg shadow-sm">
              <h3 className="font-medium text-theme-primary mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <button className="w-full py-2 border border-theme-primary rounded-lg text-theme-primary hover:bg-theme-secondary transition-colors">
                  Request a refund
                </button>
                <button className="w-full py-2 text-theme-secondary hover:text-theme-primary transition-colors">
                  View return policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
