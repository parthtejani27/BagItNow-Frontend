const loadGoogleMapsScript = (() => {
  let loadPromise = null;

  return () => {
    if (loadPromise) {
      return loadPromise;
    }

    loadPromise = new Promise((resolve, reject) => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      // Create a unique callback name
      const callbackName = `initGoogleMaps${Date.now()}`;

      // Create the script URL with all required parameters
      const scriptUrl = new URL("https://maps.googleapis.com/maps/api/js");
      scriptUrl.searchParams.append(
        "key",
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      );
      scriptUrl.searchParams.append("libraries", "places");
      scriptUrl.searchParams.append("callback", callbackName);
      scriptUrl.searchParams.append("loading", "async");
      scriptUrl.searchParams.append("v", "weekly"); // Use weekly version for stability

      // Setup callback
      window[callbackName] = () => {
        resolve(window.google.maps);
        delete window[callbackName];
      };

      // Create and append script element
      const script = document.createElement("script");
      script.src = scriptUrl.toString();
      script.async = true; // Make sure async is true
      script.defer = true;
      script.nonce = document.querySelector("script[nonce]")?.nonce || ""; // Copy nonce if CSP is used

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps"));
        loadPromise = null;
        delete window[callbackName];
      };

      document.head.appendChild(script);
    });

    return loadPromise;
  };
})();

export default loadGoogleMapsScript;
