import { APP_NAME } from "../constant/BASE_URL";
import Text from "../components/Text";
import { ITitleText } from "../types/types";

export const TitleText: React.FC<ITitleText> = ({ text }) => (
  <Text className="text-text text-4xl font-semibold mb-5 ">
    {text} {APP_NAME}
  </Text>
);
