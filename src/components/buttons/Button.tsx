import { BeatLoader } from "react-spinners"

const Button = ({ type, onClick, text, isSubmitting }: { isSubmitting?: boolean, text: string, onClick?: () => void; type?: 'submit' | 'button' | 'reset' }) => {
    return (
        <button
            type={type || 'button'}
            disabled={isSubmitting}
            className="mt-3 btn border-2 border-[#7A23FF] bg-[#7A23FF] w-full py-2 text-white rounded-[7px] hover:bg-transparent hover:text-[#7A23FF] transition-all"
            onClick={onClick}
        >
            {isSubmitting ? <BeatLoader color="var(--color-primary)" size={10} /> : text}
        </button>
    )
}


export default Button;