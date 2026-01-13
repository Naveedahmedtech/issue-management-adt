import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
    useEffect(() => {
        const el = document.getElementById("scroll-container");
        if (el) {
            el.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [pathname]);
  return null;
};

export default ScrollToTop;
