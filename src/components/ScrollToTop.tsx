import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Props = { refEl?: React.RefObject<HTMLElement> };
const ScrollToTop = ({ refEl }: Props) => {
  const { pathname } = useLocation();
  useEffect(() => {
    (refEl?.current ?? document.scrollingElement)?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
