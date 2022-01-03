import clsx from "clsx";
import Image from "next/image";

function Hero() {
  return (
    <>
      <section className="sm:grid sm:grid-cols-12 sm:gap-8">
        <div className="sm:col-span-6">
          <h1>
            <span
              className={clsx(
                "flex mt-1",
                "text-4xl sm:text-5xl",
                "font-extrabold tracking-tight"
              )}>
              <span className="block text-gray-900">Louis&nbsp;</span>
              <span className="inline-block text-primary-600">Guitton</span>
            </span>
            <span className="block text-sm font-semibold text-gray-500">
              Tech Lead NFT and Principal Machine Learning Engineer at{" "}
              <b>OneFootball</b>
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:mt-5">
            Building for myself first, for fun and learnings. Experienced with
            Natural Language Processing, Recommenders Systems, MVP Building and
            the Flow blockchain.
          </p>
        </div>
        <button
          className={clsx(
            "relative mt-12 sm:mt-0 sm:col-span-6 sm:flex sm:items-center",
            "rounded-full shadow-lg h-56 w-56",
            "mx-auto",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          )}>
          <Image
            layout="fill"
            src="https://guitton.co/images/louis.jpg"
            className="rounded-full"
            alt="Profile picture"
          />
        </button>
      </section>
    </>
  );
}

export default Hero;
