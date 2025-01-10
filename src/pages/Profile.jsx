import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileLayout from "../components/layout/ProfileLayout";
import AccountSettings from "../components/profile/AccountSettings";
import Orders from "./Orders";
import OrderHistory from "../components/order/OrderHistory";
import OrderDetails from "../components/order/OrderDetails";
import SavedAddresses from "../components/address/SavedAddresses";
// import Addresses from '../components/profile/Addresses';
// import PaymentMethods from '../components/profile/PaymentMethods';
// import NotificationSettings from '../components/profile/NotificationSettings';
// import FamilyAccount from '../components/profile/FamilyAccount';
// import Credits from '../components/profile/Credits';
// import Orders from '../components/profile/Orders';

const Profile = () => {
  return (
    <ProfileLayout>
      <Routes>
        <Route index element={<Navigate to="/profile/settings" replace />} />
        <Route path="settings" element={<AccountSettings />} />
        <Route path="orders">
          <Route index element={<OrderHistory />} />
          <Route path=":orderId" element={<OrderDetails />} />
        </Route>
        <Route path="addresses" element={<SavedAddresses />} />
        {/* <Route path="payment" element={<PaymentMethods />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="family" element={<FamilyAccount />} />
        <Route path="credits" element={<Credits />} /> */}
      </Routes>
    </ProfileLayout>
  );
};

export default Profile;
