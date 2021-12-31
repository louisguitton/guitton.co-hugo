import Footer from "./Footer";
import Header from "./Header";

const Body: React.FC<{}> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">{children}</div>
  );
}

const Container: React.FC<{}> = ({ children }) => {
  return <div className="flex-grow w-full">{children}</div>;
}

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
