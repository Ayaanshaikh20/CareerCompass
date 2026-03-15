import { useState, useEffect } from "../../shared/Imports";

const Settings = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("isDark") === "true",
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDark(localStorage.getItem("isDark") === "true");
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

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-950 p-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pb-3 mb-6 border-b border-gray-200 dark:border-gray-700">
            Settings
          </h2>

          <div className="space-y-6">
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
                  className="px-4 py-1.5 text-sm font-medium rounded transition-colors bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Settings;
