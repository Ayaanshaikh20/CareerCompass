import { useState, useEffect } from "../../shared/Imports";

const Settings = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("isDark") === "true",
  );
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD",
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem("isDark") === "true");
      setCurrency(localStorage.getItem("currency") || "USD");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("isDark", newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new Event("storage"));
  };

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
    window.dispatchEvent(new Event("storage"));
  };

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  ];

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-950 p-2 sm:p-4 min-h-full">
      <div className="max-w-4xl mx-auto">
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pb-3 mb-6 border-b border-gray-200 dark:border-gray-700">
            Preferences
          </h2>

          <div className="space-y-6">
            {/* Theme Setting */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Appearance
              </h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Theme
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Choose between light and dark mode
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>

            {/* Currency Setting */}
            {/* <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Currency
              </h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Preferred Currency
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Select your preferred currency for pricing and subscriptions
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => changeCurrency(curr.code)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        currency === curr.code
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{curr.symbol}</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {curr.code}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {curr.name}
                          </p>
                        </div>
                        {currency === curr.code && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;
