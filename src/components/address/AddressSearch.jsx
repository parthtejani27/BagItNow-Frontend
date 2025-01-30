// import React, { useEffect, useRef, useState } from "react";
// import { X, Search } from "lucide-react";
// import loadGoogleMapsScript from "../../utils/loadGoogleMapsScript";

// const AddressSearch = ({ onSelect, onClose }) => {
//   const [predictions, setPredictions] = useState([]);

//   useEffect(() => {
//     const initGoogleMaps = async () => {
//       await loadGoogleMapsScript();

//       const inputElement = document.getElementById("search-input");

//       // Initialize AutocompleteService
//       const autocompleteService =
//         new window.google.maps.places.AutocompleteService();

//       inputElement.addEventListener("input", async (event) => {
//         const query = event.target.value;

//         if (!query) {
//           setPredictions([]);
//           return;
//         }

//         const country = "ca";
//         autocompleteService.getPlacePredictions(
//           {
//             input: query,
//             types: ["address"],
//             componentRestrictions: { country },
//           },
//           (predictions, status) => {
//             if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//               setPredictions(predictions || []);
//             } else {
//               setPredictions([]);
//               console.error("Error fetching predictions:", status);
//             }
//           }
//         );
//       });
//     };

//     initGoogleMaps();
//   }, []);

//   const formatAddress = (place, latitude, longitude) => {
//     const addressComponents = place.address_components || [];
//     const getComponent = (type) => {
//       const component = addressComponents.find((c) => c.types.includes(type));
//       return component ? component.long_name : "";
//     };

//     return {
//       type: "Other",
//       address: place.formatted_address || place.name || "",
//       streetNumber: getComponent("street_number"),
//       unit: null, // Units are typically not provided in place results
//       streetName: getComponent("route") || getComponent("pedestrian") || "",
//       city:
//         getComponent("locality") ||
//         getComponent("administrative_area_level_2") || // Sometimes cities are listed here
//         getComponent("sublocality") ||
//         "",
//       state: getComponent("administrative_area_level_1") || "",
//       country: getComponent("country") || "",
//       zipcode: getComponent("postal_code") || "",
//       lat: latitude,
//       lng: longitude,
//       additionalInfo: "",
//       dropoffOption: "Leave at door",
//       deliveryInstructions: "",
//       isDefault: true,
//     };
//   };

//   const getUserCountry = async () => {
//     try {
//       const response = await fetch("https://ipapi.co/json/");
//       const data = await response.json();
//       return data ? data.country_code.toLowerCase() : "ca";
//     } catch (error) {
//       console.error("Error fetching user country:", error);
//       return null;
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
//       <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-lg">
//         <div className="px-5 py-4">
//           {/* Header Section */}
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-lg font-semibold text-gray-900">Deliver to</h2>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-200 rounded-full transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           {/* Input Section */}
//           <div className="relative">
//             <input
//               id="search-input"
//               type="text"
//               placeholder="Enter delivery address"
//               className="w-full pl-10 pr-16 py-2 text-gray-800 bg-gray-100 rounded-full border border-gray-300
//                 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="w-5 h-5 text-gray-500" />
//             </div>
//             <button
//               className="absolute inset-y-0 right-0 pr-3 text-blue-500 font-medium"
//               onClick={() => {
//                 document.getElementById("search-input").value = "";
//                 setPredictions([]);
//               }}
//             >
//               Clear
//             </button>
//           </div>

//           {/* Predictions Section */}
//           {predictions.length > 0 && (
//             <ul className="mt-2 border-t border-gray-200">
//               {predictions.map((prediction) => (
//                 <li
//                   key={prediction.place_id}
//                   className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
//                   onClick={() => {
//                     const service = new window.google.maps.places.PlacesService(
//                       document.createElement("div")
//                     );
//                     service.getDetails(
//                       { placeId: prediction.place_id },
//                       (place, status) => {
//                         if (
//                           status ===
//                           window.google.maps.places.PlacesServiceStatus.OK
//                         ) {
//                           const latitude = place.geometry.location.lat();
//                           const longitude = place.geometry.location.lng();
//                           const formattedAddress = formatAddress(
//                             place,
//                             latitude,
//                             longitude
//                           );
//                           onSelect(formattedAddress);
//                         } else {
//                           console.error(
//                             "Failed to fetch place details:",
//                             status
//                           );
//                         }
//                       }
//                     );
//                   }}
//                 >
//                   <div className="font-medium text-gray-800">
//                     {prediction.structured_formatting.main_text}
//                   </div>
//                   <div className="text-sm text-gray-500">
//                     {prediction.structured_formatting.secondary_text}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddressSearch;
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Search, MapPin, Loader2 } from "lucide-react";
import loadGoogleMapsScript from "../../utils/loadGoogleMapsScript";
import {
  detectCurrentLocation,
  selectLocationLoading,
  selectLocationError,
} from "../../store/slices/addressSlice";
import { setSelectedAddress } from "../../store/slices/deliverySlice";

const AddressSearch = ({ onSelect, onClose }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const isLocating = useSelector(selectLocationLoading);
  const locationError = useSelector(selectLocationError);

  useEffect(() => {
    const initGoogleMaps = async () => {
      await loadGoogleMapsScript();
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      if (searchText) {
        autocompleteService.getPlacePredictions(
          {
            input: searchText,
            types: ["address"],
            componentRestrictions: { country: "ca" },
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPredictions(predictions || []);
            } else {
              setPredictions([]);
            }
          }
        );
      }
    };

    const timeoutId = setTimeout(() => {
      if (searchText) {
        initGoogleMaps();
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const formatAddress = (place, latitude, longitude) => {
    const addressComponents = place.address_components || [];
    const getComponent = (type) => {
      const component = addressComponents.find((c) => c.types.includes(type));
      return component ? component.long_name : "";
    };

    return {
      type: "Other",
      address: place.formatted_address || place.name || "",
      streetNumber: getComponent("street_number"),
      unit: null, // Units are typically not provided in place results
      streetName: getComponent("route") || getComponent("pedestrian") || "",
      city:
        getComponent("locality") ||
        getComponent("administrative_area_level_2") || // Sometimes cities are listed here
        getComponent("sublocality") ||
        "",
      state: getComponent("administrative_area_level_1") || "",
      country: getComponent("country") || "",
      zipcode: getComponent("postal_code") || "",
      lat: latitude,
      lng: longitude,
      additionalInfo: "",
      dropoffOption: "Leave at door",
      deliveryInstructions: "",
      isDefault: true,
    };
  };

  const handleAddressSelect = (prediction) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId: prediction.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const addressComponents = place.address_components || [];
        const getComponent = (type) => {
          const component = addressComponents.find((c) =>
            c.types.includes(type)
          );
          return component ? component.long_name : "";
        };

        const formattedAddress = {
          type: "Other",
          address: place.formatted_address || place.name || "",
          streetNumber: getComponent("street_number"),
          unit: null, // Units are typically not provided in place results
          streetName: getComponent("route") || getComponent("pedestrian") || "",
          city:
            getComponent("locality") ||
            getComponent("administrative_area_level_2") || // Sometimes cities are listed here
            getComponent("sublocality") ||
            "",
          state: getComponent("administrative_area_level_1") || "",
          country: getComponent("country") || "",
          zipcode: getComponent("postal_code") || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          additionalInfo: "",
          dropoffOption: "Leave at door",
          deliveryInstructions: "",
          isDefault: true,
        };
        onSelect(formattedAddress);
      }
    });
  };

  const handleCurrentLocation = async () => {
    try {
      const address = await dispatch(detectCurrentLocation()).unwrap();
      onSelect(address);
    } catch (error) {
      console.error("Failed to detect location:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-14">
      <div className="bg-theme-primary w-full max-w-md mx-4 rounded-2xl shadow-lg">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-theme-primary">Addresses</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-theme-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-theme-primary" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for an address"
              className="w-full pl-10 pr-16 py-3 bg-theme-secondary text-theme-primary 
                rounded-full border border-theme-primary focus:outline-none focus:ring-2"
              autoFocus
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-theme-tertiary" />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-2.5 text-blue-500 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 mb-4
              bg-theme-secondary text-theme-primary rounded-full 
              hover:bg-theme-tertiary transition-colors font-medium text-base
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Detecting location...</span>
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                <span>Use current location</span>
              </>
            )}
          </button>

          {/* Location Error */}
          {locationError && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              Failed to detect location. Please try again or enter address
              manually.
            </div>
          )}

          {/* Predictions List */}
          {predictions.length > 0 && (
            <div className="mt-2 border-t border-theme-primary pt-4">
              <div className="space-y-2">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => handleAddressSelect(prediction)}
                    className="w-full text-left p-3 hover:bg-theme-secondary rounded-lg transition-colors"
                  >
                    <div className="font-medium text-theme-primary">
                      {prediction.structured_formatting.main_text}
                    </div>
                    <div className="text-sm text-theme-tertiary">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {searchText && predictions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-theme-tertiary">No addresses found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSearch;
