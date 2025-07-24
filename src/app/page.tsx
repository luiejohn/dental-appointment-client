import Link from "next/link";

export const metadata = {
  title: "Dental Scheduler | Home",
  description:
    "Welcome to the Dental Scheduler. Schedule your appointment online with ease.",
};

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="bg-gradient-to-r from-blue-500 to-teal-400 text-white py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to Our Dental Office
        </h1>

        <p className="text-xl max-w-2xl mx-auto">
          We provide top-notch dental care for the whole family. Schedule your
          appointment with our expert dentists today!
        </p>

        <Link
          href="/booking"
          className="mt-8 inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
        >
          Schedule an Appointment
        </Link>
      </section>

      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-2xl font-semibold mb-2">Preventive Care</h3>

            <p>
              Regular cleanings, exams, and x-rays to keep your smile healthy.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-2xl font-semibold mb-2">Cosmetic Dentistry</h3>

            <p>Teeth whitening, veneers, and more to enhance your smile.</p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="text-2xl font-semibold mb-2">Orthodontics</h3>

            <p>Braces and aligners for straighter teeth and a perfect bite.</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>

        <p className="max-w-3xl mx-auto text-center">
          At Dental Scheduler, our mission is to provide compassionate,
          comprehensive, and personalized dental care in a comfortable
          environment. Our team of professionals uses the latest technology and
          techniques to ensure you receive the best treatment possible.
        </p>
      </section>
    </div>
  );
}
