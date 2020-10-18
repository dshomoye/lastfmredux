import { Fragment } from "react";
import Link from 'next/link'

const navs = [
  {
    label: "HOME",
    href: "/",
  },
  {
    label: "UPDATE",
    href: "/update",
  },
  {
    label: "VIEW",
    href: "/stats",
  },
];

const Header = ({ page }) => (
  <div className="fixed z-10">
    <ul className="flex justify-center pt-5 pb-5 h-16 shadow-lg w-screen bg-white">
      {navs.map((n) => (
        <Fragment key={n.href}>
          {n.label === page ? (
            <li className="text-gray-900 px-5 text-lg font-bold lg:px-10 underline" key={n.href}>
              <a>{n.label}</a>
            </li>
          ) : (
            <li
              className="text-gray-600 hover:text-gray-800 hover:text-xl hover:underline text-lg transition-all duration-500 font-bold px-3 lg:px-8"
              key={n.href}
            >
              <Link href={n.href}><a>{n.label}</a></Link>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  </div>
);

export default Header;
