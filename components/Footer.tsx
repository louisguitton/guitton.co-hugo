// Ref: https://devdojo.com/tails/app#_ Footer 3

const navigation = {
  site: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Resume", href: "/resume" },
    { name: "Freelance", href: "/freelance" },
    { name: "Blog", href: "/posts" },
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
    { name: "Contact", href: "/contact" },
    { name: "Awesome Tutos", href: "#" },
    { name: "Feed", href: "#" },
    { name: "2055", href: "#" },
  ],
};

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white" aria-labelledby="footer-heading">
      <div className="px-8 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 mb-3 md:grid-cols-3 lg:grid-cols-12 lg:gap-20">
          <div className="col-span-3">
            {/* <a
              href="#_"
              className="text-xl font-black leading-none text-gray-900 select-none logo">
              guitton.co
            </a> */}
            <p className="text-sm leading-normal text-gray-500">
              Made in Berlin 🇩🇪 with NextJS, TailwindCSS, and Vercel.
            </p>
          </div>
          <nav className="col-span-1 md:col-span-1 lg:col-span-2">
            <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Site
            </p>
            {navigation.site.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex mb-3 text-sm font-medium text-gray-500 transition hover:text-gray-700 md:mb-2 hover:text-primary">
                {item.name}
              </a>
            ))}
          </nav>
          <nav className="col-span-1 md:col-span-1 lg:col-span-2">
            <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Social
            </p>
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex mb-3 text-sm font-medium text-gray-500 transition hover:text-gray-700 md:mb-2 hover:text-primary">
                {item.name}
              </a>
            ))}
          </nav>
          <nav className="col-span-1 md:col-span-1 lg:col-span-2">
            <p className="mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Other
            </p>
            {navigation.other.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex mb-3 text-sm font-medium text-gray-500 transition hover:text-gray-700 md:mb-2 hover:text-primary">
                {item.name}
              </a>
            ))}
          </nav>
          <div className="col-span-3">
            <p className="mb-6 text-sm text-right text-gray-600 md:mb-0">
              © Copyright 2022 Louis Guitton. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
