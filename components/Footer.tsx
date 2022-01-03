// Ref: https://devdojo.com/tails/app#_ Footer 3

import clsx from "clsx";
import Link from "next/link";
import { px } from "../styles/constants";

function isExternal(href: string) {
  return href.startsWith("http");
}

const navigation = {
  site: [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/posts" },
    // TODO: { name: "About", href: "/about" },
    // TODO: { name: "Resume", href: "/resume" },
    // TODO: { name: "Freelance", href: "/freelance" },
  ],
  social: [
    { name: "Twitter", href: "https://twitter.com/louis_guitton" },
    { name: "Github", href: "https://github.com/louisguitton" },
    {
      name: "Discord",
      href: "https://discordapp.com/users/217929937842208768",
    },
  ],
  other: [
    // TODO: { name: "Contact", href: "/contact" },
    { name: "Awesome Tutos", href: "https://awesome-tutos.guitton.co/" },
    { name: "2055", href: "https://louisguitton.github.io/2055/" },
    // TODO: { name: "Feed", href: "#" },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className={clsx(px, "pt-12")} aria-labelledby="footer-heading">
      <div className="grid grid-cols-3 gap-10">
        <div className={clsx("col-span-3", "text-sm text-gray-500")}>
          Made in 🇩🇪 Berlin with TypeScript, NextJS, TailwindCSS, and Vercel.
        </div>
        {Object.entries(navigation).map(([key, value]) => {
          return (
            <nav
              aria-labelledby="footer-navigation"
              className={clsx("col-span-1", "flex flex-col", "space-y-2")}
              key={key}>
              <p
                className={clsx(
                  "mb-1",
                  "text-xs font-semibold tracking-wider text-gray-400 uppercase"
                )}>
                {key}
              </p>
              {value.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 hover:text-primary"
                    target={isExternal(item.href) ? "_blank" : "_self"}>
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          );
        })}
        <div className="col-span-3">
          <p className="mb-6 text-sm text-gray-500">
            © Copyright 2022 Louis Guitton. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
