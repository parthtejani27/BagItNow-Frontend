import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DeliveryDetails from "../components/checkout/DeliveryDetails";

import OrderSummary from "../components/checkout/OrderSummary";

import DeliveryOptions from "../components/checkout/DeliveryOptions";
import {
  selectSelectedAddress,
  selectSelectedDate,
  selectSelectedTimeslot,
  setSelectedAddress,
  setSelectedTimeslot,
} from "../store/slices/deliverySlice";
import {
  clearCart,
  selectCartDeliveryFee,
  selectCartItems,
  selectCartSubTotal,
  selectCartTaxes,
  selectCartTotal,
  updateDeliveryFee,
} from "../store/slices/cartSlice";
import AddressModal from "../components/address/AddressModal";
import {
  selectIsAuthenticated,
  SelectStripeCustomerId,
  selectUser,
} from "../store/slices/authSlice";
import { clearCheckout, createOrder } from "../store/slices/checkoutSlice";
import DropoffOptions from "../components/address/DropoffOptions";
import TimeSlotSelection from "../components/address/TimeSlotSelection";
import moment from "moment";
import { useCartCalculations } from "../hooks/useCartCalculations";
import {
  getPaymentMethods,
  saveCard,
  selectPaymentMethods,
  setDefaultPaymentMethod,
} from "../store/slices/paymentSlice";
import PaymentMethodModal from "../components/payment/PaymentMethodModal";
import CreditCardForm from "../components/payment/CreditCardForm";
import StripeCardForm from "../components/payment/StripeCardForm";
import { X } from "lucide-react";
import SavedCards from "../components/payment/SavedCards";

// import { Loader } from "../components/common/Loader";
// import { AlertCircle } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDropOffModal, setShowDropOffModal] = useState(false);
  const [showTimeSlotSelection, setShowTimeSlotSelection] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [error, setError] = useState(null);

  const cartItems = useSelector(selectCartItems);
  const userAddress = useSelector(selectSelectedAddress);
  const timeSlot = useSelector(selectSelectedTimeslot);
  const selectedDate = useSelector(selectSelectedDate);

  const paymentMethods = useSelector(selectPaymentMethods);
  const stripeCustomerId = useSelector(SelectStripeCustomerId);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      dispatch(getPaymentMethods(stripeCustomerId));
    }
  }, [dispatch, stripeCustomerId, user]);

  const handleDeliveryOptionChange = (newFee) => {
    dispatch(updateDeliveryFee(newFee));
  };
  console.log(cartItems);

  const formatTime = (timeslot) => {
    return `${moment(timeslot.startTime).format("h:mm a")} - ${moment(
      timeslot.endTime
    ).format("h:mm a")}`;
  };

  const deliveryOptions = [
    {
      id: "priority",
      type: "priority",
      title: "Priority",
      description: "20-45 min • Delivered directly to you",
      price: 1.99,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "standard",
      type: "standard",
      title: "Standard",
      description: "25-50 min",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "schedule",
      type: "Schedule",
      title: selectedDate ? selectedDate : "Schedule",
      description: timeSlot ? formatTime(timeSlot) : "Choose a time",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = timeSlot === "priority" ? 2.99 : 0;
    const taxes = subtotal * 0.13; // 13% tax rate
    const total = subtotal + deliveryFee + taxes;

    return {
      subtotal,
      deliveryFee,
      taxes,
      total,
    };
  };

  const totals = calculateTotals();

  const handleEditAddress = () => {
    setShowAddressModal(true);
  };

  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
  };

  const handleEditInstructions = () => {
    setShowDropOffModal(true);
  };

  const handleCloseEditInstructions = () => {
    setShowDropOffModal(false);
  };

  const handleCloseTimeSlotSelection = () => {
    setShowTimeSlotSelection(false);
  };

  const handleAddPaymentClick = () => {
    console.log("payment method");
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (methodId) => {
    if (methodId === "card") {
      setShowPaymentModal(false);
      setShowCardForm(true);
    } else {
      // Handle Google Pay or Apple Pay
      handlePaymentWithWallet(methodId);
    }
  };

  const handlePaymentWithWallet = async (methodType) => {
    setIsLoading(true);
    setError(null);

    try {
      // Handle wallet payment
      console.log("Processing wallet payment:", methodType);
      setShowPaymentModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSubmit = async (paymentMethod) => {
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(
        saveCard({
          paymentMethodId: paymentMethod.id,
          isDefault: true,
        })
      ).unwrap();

      setShowCardForm(false);
      // Refresh payment methods
      dispatch(getPaymentMethods(stripeCustomerId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavedCardSelect = async (paymentMethodId) => {
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(setDefaultPaymentMethod(paymentMethodId)).unwrap();
      // Handle successful card selection
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropoffUpdate = (dropoffDetails) => {
    dispatch(setSelectedAddress({ ...userAddress, ...dropoffDetails }));
    setShowDropOffModal(false);
  };

  const handleDeliveryOption = (option) => {
    console.log(option);
    if (option === "schedule") {
      setShowTimeSlotSelection(true);
    } else {
      dispatch(setSelectedTimeslot(option));
    }
  };

  const handlePromoCode = () => {
    navigate("/checkout/promo");
  };

  const handlePaymentContinue = async () => {
    if (!userAddress || !timeSlot || !paymentMethods?.length) {
      setError("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        address: userAddress._id,
        deliveryOption: "standard",
        timeslot: timeSlot._id,
      };

      const { order } = await dispatch(createOrder(orderData)).unwrap();

      // Clear cart and checkout state
      dispatch(clearCart());
      dispatch(clearCheckout());

      // Navigate to order confirmation page
      navigate(`/orders/${order._id}`);
    } catch (error) {
      setError(error.message || "Failed to create order");
      console.error("Order failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-theme-primary">
        <h1 className="text-2xl font-semibold text-theme-primary mb-4">
          Your cart is empty
        </h1>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-accent-success text-white rounded-full hover:bg-accent-success-dark transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-secondary">
      {/* Header */}
      <header className="bg-theme-primary border-b border-theme-primary">
        <div className="container-custom py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors duration-200"
            >
              <svg
                className="w-6 h-6 text-theme-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-theme-primary ml-4">
              Checkout
            </h1>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Delivery Details and Options */}
          <div className="space-y-6">
            <DeliveryDetails
              address={userAddress}
              onEdit={{
                address: handleEditAddress,
                instructions: handleEditInstructions,
              }}
            />

            <DeliveryOptions
              selectedOption={timeSlot}
              onOptionSelect={handleDeliveryOption}
              options={deliveryOptions}
            />

            {/* Payment Method */}
            <div className="p-6 bg-theme-primary rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-theme-primary mb-6">
                Payment
              </h2>
              {paymentMethods?.length > 0 ? (
                <SavedCards
                  cards={paymentMethods}
                  onSelect={handleSavedCardSelect}
                  onAddCard={() => setShowPaymentModal(true)}
                />
              ) : (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full p-4 border border-theme-primary rounded-lg flex justify-between items-center hover:bg-theme-secondary transition-colors"
                >
                  <span className="text-theme-primary">Add payment method</span>
                  <X className="w-5 h-5 text-theme-primary" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Cart Summary */}
          <div className="lg:sticky lg:top-6">
            <OrderSummary
              items={cartItems}
              onPromoCode={() => {
                // Handle promo code
              }}
            />

            <button
              onClick={handlePaymentContinue}
              disabled={isLoading}
              className="w-full mt-6 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  {/* <Loader className="w-5 h-5" /> */}
                  <span>Processing...</span>
                </div>
              ) : (
                "Continue with Payment"
              )}
            </button>
          </div>
        </div>
      </main>
      {showAddressModal && (
        <AddressModal
          onClose={handleCloseAddressModal}
          isAuthenticated={isAuthenticated}
          hideTimePreference={true}
        />
      )}
      {showDropOffModal && (
        <DropoffOptions
          address={userAddress}
          currentOption={userAddress?.dropoffOption}
          onClose={handleCloseEditInstructions}
          onUpdate={handleDropoffUpdate}
        />
      )}

      {showTimeSlotSelection && (
        <TimeSlotSelection onClose={handleCloseTimeSlotSelection} />
      )}

      {showPaymentModal && (
        <PaymentMethodModal
          onClose={() => setShowPaymentModal(false)}
          onSelectMethod={handlePaymentMethodSelect}
        />
      )}

      {showCardForm && (
        <StripeCardForm
          onClose={() => setShowCardForm(false)}
          onSuccess={handleCardSubmit}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
