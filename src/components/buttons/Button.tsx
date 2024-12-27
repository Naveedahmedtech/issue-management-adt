import { BeatLoader } from "react-spinners";
import clsx from "clsx";

const Button = ({
                    type,
                    onClick,
                    text,
                    isSubmitting,
                    className,
                    preview = "primary",
                    fullWidth = true,
                }: {
    isSubmitting?: boolean;
    text: string;
    onClick?: () => void;
    type?: "submit" | "button" | "reset";
    className?: string;
    preview?: "primary" | "secondary" | "danger";
    fullWidth?: boolean;
}) => {
    return (
        <button
            type={type || "button"}
            disabled={isSubmitting}
            className={clsx(
                "mt-3 btn px-2 py-2 rounded-[7px] transition-all",
                fullWidth ? 'w-full' : '',
                preview === "primary" && "border-2 border-[var(--color-primary)] bg-[var(--color-primary)] text-background font-bold hover:bg-transparent hover:text-[var(--color-primary)]",
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
