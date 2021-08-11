import Head from "next/head";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>Lessons.church - Free Church Curriculum</title>
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}