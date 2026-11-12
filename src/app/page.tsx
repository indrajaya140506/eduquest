import Navbar from "@/components/layouts/navbar";
import Hero from "@/components/landing/section/Hero";
import Tentang from "@/components/landing/section/Tentang";
import Panduan from "@/components/landing/section/Panduan";
import Footer from "@/components/layouts/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Tentang />
      <Panduan />
      <Footer />
    </main>
  );
}
