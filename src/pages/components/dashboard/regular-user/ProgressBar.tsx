interface ProgressBarProps {
    duration?: number; // optional duration for animation
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration = 5 }) => (
    <div className="w-full bg-border rounded h-2 overflow-hidden">
        <div
            className="bg-primary h-full"
            style={{
                animation: `progress ${duration}s linear forwards`,
            }}
        ></div>
    </div>
);

export default ProgressBar;
