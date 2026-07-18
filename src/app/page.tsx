import Banner from "@/components/Banner";
import FeaturedItems from "@/components/FeaturedItems";
import Categories from "@/components/Categories";
import WhyChooseUs from "@/components/WhyChooseUs";
import Statistics from "@/components/Statistics";
import Testimonials from "@/components/Testimonials";
import LatestBlogs from "@/components/LatestBlogs";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedItems />
      <Categories />
      <WhyChooseUs />
      <Statistics />
      <Testimonials />
      <LatestBlogs />
      <FAQ />
      <Newsletter />
      <CTA />
    </>
  );
}
