"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Transition } from "@headlessui/react";
import {
  HiMenu,
  HiHome,
  HiUser,
  HiShoppingCart,
} from "react-icons/hi";
import { FaBoxOpen, FaTags } from "react-icons/fa";
import { HiOutlineXMark } from "react-icons/hi2";

const DrawerNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer text-black font-medium rounded-lg text-sm focus:outline-none"
      >
        <HiMenu size={24} />
      </div>

      <Transition
        show={isOpen}
        enter="transition-transform duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed top-0 right-0 z-[9999] w-64 h-screen p-4 overflow-y-auto bg-white shadow-md">
          <div className="flex justify-between items-center mb-4">
            <img
              src="/pwa-512x512.svg"
              width={60}
              height={60}
              alt="ShopLogo"
              className="w-10 h-10"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="text-black rounded-lg p-1.5"
            >
              <HiOutlineXMark size={20} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <ul className="space-y-2 font-medium">
            <DrawerItem label="صفحه اصلی فروشگاه" icon={<HiHome size={20} />} />
            <DrawerItem label="دسته بندی ها" icon={<FaTags size={20} />} />
            <DrawerItem label="تخفیفات شگفت انگیز" icon={<FaBoxOpen size={20} />} />
            <DrawerItem label="سبد خرید" icon={<HiShoppingCart size={20} />} badge="3" />
            <DrawerItem label="ورود و ثبت نام" icon={<HiUser size={20} />} />
          </ul>
        </div>
      </Transition>
    </>
  );
};

type DrawerItemProps = {
  label: string;
  icon: ReactNode;
  badge?: string;
};

const DrawerItem = ({ label, icon, badge }: DrawerItemProps) => (
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
    >
      <div className="mr-3">{icon}</div>
      <span className="flex-1 whitespace-nowrap">{label}</span>
      {badge && (
        <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </a>
  </li>
);

export default DrawerNavigation;
