import { BeatLoader } from "react-spinners";
import clsx from "clsx";

const Button = ({
                    type,
                    onClick,
                    text,
                    isSubmitting,
                    className,
                    preview = "primary",
                }: {
    isSubmitting?: boolean;
    text: string;
    onClick?: () => void;
    type?: "submit" | "button" | "reset";
    className?: string;
    preview?: "primary" | "secondary" | "danger";
}) => {
    return (
        <button
            type={type || "button"}
            disabled={isSubmitting}
            className={clsx(
                "mt-3 btn w-full py-2 rounded-[7px] transition-all",
                preview === "primary" && "border-2 border-[#7A23FF] bg-[#7A23FF] text-white hover:bg-transparent hover:text-[#7A23FF]",
                preview === "secondary" && "border-2 border-gray-400 bg-gray-400 text-white hover:bg-transparent hover:text-gray-400",
                preview === "danger" && "border-2 border-red-600 bg-red-600 text-white hover:bg-transparent hover:text-red-600",
                className
            )}
            onClick={onClick}
        >
            {isSubmitting ? <BeatLoader color="var(--color-primary)" size={10} /> : text}
        </button>
    );
};

export default Button;
