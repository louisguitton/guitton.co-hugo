import clsx from "clsx";
import { bg, px } from "../styles/constants";

import Footer from "./Footer";
import Header from "./Header";

const Body: React.FC<{}> = ({ children }) => {
  return (
    <div
      className={clsx(
        "flex flex-col",
        "h-screen",
        "max-w-screen-md mx-auto",
        bg
      )}>
      {children}
    </div>
  );
};

const Container: React.FC<{}> = ({ children }) => {
  return <main className={clsx("flex-grow", px)}>{children}</main>;
};

const Page: React.FC<{}> = ({ children }) => {
  return (
    <Body>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </Body>
  );
};

export default Page;
