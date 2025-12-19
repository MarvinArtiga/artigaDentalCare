import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { BlogPreview } from "@/components/BlogPreview";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <About />
      <BlogPreview />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
