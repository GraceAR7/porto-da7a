import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Assemble from "@/components/Assemble";

export default function Page() {
  return (
    <>
      <Loader />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Assemble>
          <About />
        </Assemble>
        <Assemble>
          <Projects />
        </Assemble>
        <Assemble>
          <Contact />
        </Assemble>
      </main>
      <Footer />
    </>
  );
}
