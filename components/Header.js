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
    <ul className="flex justify-center py-5 shadow-lg w-screen bg-white">
      {navs.map((n) => (
        <Fragment key={n.href}>
          {n.label === page ? (
            <li className="text-gray-900 mx-3" key={n.href}>
              <a>{n.label}</a>
            </li>
          ) : (
            <li
              className="text-blue-600 hover:text-gray-800 mr-6 text-md font-bold border-gray-700 mx-3"
              key={n.href}
            >
              <Link href={n.href}>{n.label}</Link>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  </div>
);

export default Header;
