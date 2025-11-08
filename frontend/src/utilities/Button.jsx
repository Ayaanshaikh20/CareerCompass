import { Button } from "../shared/Imports"

const CustomButton = ({ children, handleClick, variant, type }) => {
    return (
        variant === "primary" ? (
            <Button
                onClick={handleClick}
                type={type}
                size="2"
                variant="solid"
                className="bg-primary text-buttonText hover:bg-primaryHover px-5"
            >
                {children}
            </Button>
        ) : variant === "secondary" ? (
            <Button
                onClick={handleClick}
                type={type}
                size="2"
                variant="solid"
                className="bg-secondary text-textSecondary hover:bg-secondaryHover px-5"
            >
                {children}
            </Button>
        ) : variant === "disabled" ? (
            <Button
                size="2"
                type={type}
                disabled={true}
                variant="solid"
                className=" px-5"
            >
                {children}
            </Button>
        ) : (<></>)
    )
};

export {
    CustomButton
}