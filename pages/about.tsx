import { NextSeo } from "next-seo";
import type { GetStaticProps, NextPage } from "next";

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    // For SEO
    url: new URL("/about", process.env.BASE_URL).href,
  },
});

const AboutPage: NextPage<{ url: string }> = ({ url }) => {
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

      <div>
        <h1>About me</h1>
        I&apos;m Louis.
      </div>
    </>
  );
};

export default AboutPage;
