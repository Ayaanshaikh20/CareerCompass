import { CustomButton } from "../../utilities/CustomButton";
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
      <CustomButton
        variant="primary"
        className="px-6 py-2 text-base font-medium"
        handleClick={() => navigate("/")}
      >
        Go Home
      </CustomButton>

      {/* Optional footer note */}
      <p className="mt-6 text-sm text-textSecondary">
        If you think this is a mistake, please contact support.
      </p>
    </div >
  );
};

export default NotFound;
