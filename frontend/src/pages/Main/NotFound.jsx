import { useNavigate } from "../../shared/Imports";
import { NotFound as NotFoundIcon } from "../../shared/Icons";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background px-6">
      {/* Icon */}
      <div className="">
        {NotFoundIcon ? (
          <img className="w-100 max-w-sm md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl" src={NotFoundIcon} alt="404" />
        ) : (
          <div className="text-7xl font-bold text-textSecondary">😕</div>
        )}
      </div>

      {/* 404 heading */}
      <h1 className="text-5xl font-extrabold text-textPrimary mb-3">
        404
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-textSecondary mb-8">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Action button */}
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
      >
        Go Home
      </button>

      {/* Optional footer note */}
      <p className="mt-6 text-sm text-textSecondary">
        If you think this is a mistake, please contact support.
      </p>
    </div >
  );
};

export default NotFound;
