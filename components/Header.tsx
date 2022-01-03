// Ref: https://tailwindui.com/components/application-ui/navigation/navbars#component-aaed25b299f2015d2c4276b98d463cee
// Ref: https://headlessui.dev/react/disclosure
import clsx from "clsx";
import Link from "next/link";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ShoppingBagIcon } from "@heroicons/react/solid";
import { px } from "../styles/constants";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/posts" },
];

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <Disclosure as="header" className={clsx(px, "pb-12")}>
      {({ open }) => (
        <nav aria-labelledby="primary-navigation">
          <div className="flex items-center justify-between h-16">
            <div className="flex">
              <Link href="/">
                <a className="flex items-center space-x-2">
                  <ShoppingBagIcon className="w-8 h-8 fill-primary-600" />
                  <span className="hidden text-xl font-black leading-none text-gray-900 select-none sm:block">
                    guitton<span className="text-primary-600">.</span>co
                  </span>
                </a>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((nav) => {
                  return (
                    <Link key={nav.name} href={nav.href}>
                      <a
                        className={clsx(
                          "inline-flex  px-1 pt-1",
                          "text-sm font-medium",
                          "border-b-2",
                          router.pathname == nav.href
                            ? " text-gray-900 border-primary-500"
                            : "text-gray-500  border-transparent hover:border-gray-300 hover:text-gray-700"
                        )}>
                        {nav.name}
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex -mr-2 sm:hidden">
              <Disclosure.Button className="inline-flex justify-center p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XIcon className="block w-6 h-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel
            className={clsx("sm:hidden", "pt-2 pb-3 space-y-1")}>
            {navigation.map((nav) => {
              return (
                <Disclosure.Button
                  key={nav.name}
                  as="a"
                  href={nav.href}
                  className={clsx(
                    "block py-2 pl-3 pr-4",
                    "text-base font-medium",
                    "border-l-4",
                    router.pathname == nav.href
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  )}>
                  {nav.name}
                </Disclosure.Button>
              );
            })}
          </Disclosure.Panel>
        </nav>
      )}
    </Disclosure>
  );
};

export default Header;
