import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import type { GetStaticProps, NextPage } from "next";

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    // For SEO
    host: process.env.BASE_URL!,
    url: new URL("/about", process.env.BASE_URL).href,
  },
});

const AboutPage: NextPage<{ host: string; url: string }> = ({ host, url }) => {
  return (
    <>
      <NextSeo
        title="About"
        canonical={url}
        openGraph={{
          title: "guitton.co | About",
          url: url,
          type: "profile",
          profile: {
            firstName: "Louis",
            lastName: "Guitton",
            gender: "male",
            username: "louis_guitton",
          },
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "guitton.co",
            item: host,
          },
          {
            position: 2,
            name: "about",
            item: url,
          },
        ]}
      />

      <div>
        <h1>About me</h1>
        I&apos;m Louis.
      </div>
    </>
  );
};

export default AboutPage;
