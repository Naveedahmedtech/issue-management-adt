import { AiOutlineClockCircle } from 'react-icons/ai'; // Clock icon for a "coming soon" theme
import { BsFillArrowRightCircleFill } from 'react-icons/bs'; // Arrow icon for call-to-action
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col justify-center items-center h-[90vh] bg-backgroundShade1 p-6 text-center text-text">
      <div className="flex flex-col items-center space-y-6">
        <AiOutlineClockCircle className="text-6xl text-primary animate-bounce" />
        <h1 className="text-4xl font-bold text-text">Coming Soon</h1>
        <p className="text-lg text-text max-w-md">
          We're working hard to bring you this new feature! Stay tuned for updates and more exciting content. In the meantime, feel free to explore our other features and offerings.
        </p>
        <button onClick={() => navigate("/home")} className="flex items-center space-x-2 bg-primary text-text px-4 py-2 rounded-lg shadow-lg hover:bg-primary transition duration-300">
          <span>Explore Other Features</span>
          <BsFillArrowRightCircleFill className="text-lg " />
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
