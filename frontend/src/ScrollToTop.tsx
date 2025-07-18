// src/components/ScrollToTop.tsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // این افکت با هر بار تغییر مسیر (pathname) اجرا می‌شود

  return null; // این کامپوننت هیچ چیزی را رندر نمی‌کند
};

export default ScrollToTop;