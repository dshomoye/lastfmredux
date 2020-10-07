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
    <ul className="flex justify-center py-6 shadow-lg w-screen bg-white">
      {navs.map((n) => (
        <Fragment key={n.href}>
          {n.label === page ? (
            <li className="text-gray-900 px-5 text-md font-bold lg:px-10 border-t-4 border-gray-800" key={n.href}>
              <a>{n.label}</a>
            </li>
          ) : (
            <li
              className="text-blue-600 hover:text-gray-800 text-md font-bold px-3 lg:px-8 border-t-2 border-gray-700"
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
