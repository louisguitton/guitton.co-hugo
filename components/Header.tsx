import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="w-full px-8 text-gray-700 bg-white">
      <div className="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
        <div className="relative flex flex-col md:flex-row">
          <Link href="/">
            <a className="flex items-center mb-5 font-medium text-gray-900 lg:w-auto lg:items-center lg:justify-center md:mb-0">
              <span className="mx-auto text-xl font-black leading-none text-gray-900 select-none">
                guitton<span className="text-indigo-600">.</span>co
              </span>
            </a>
          </Link>

          <nav className="flex flex-wrap items-center mb-5 text-base md:mb-0 md:pl-8 md:ml-8 md:border-l md:border-gray-200">
            <Link href="/">
              <a className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900">
                Home
              </a>
            </Link>
            <Link href="/posts/dbt-artifacts">
              <a className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900">
                Blog
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
