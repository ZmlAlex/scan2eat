import { Icons } from "~/components/Icons";

const features = [
  {
    icon: "🚄",
    title: "Optimized for Web",
    description:
      "The generated menu page has been optimized for search engines.",
  },
  {
    icon: "🌍",
    title: "Multilanguage",
    description: "Multiple languages for your restaurant",
  },
  {
    icon: "🤑",
    title: "Free usage",
    description:
      "Free forever. No trials, feature limitations, or menu volume restrictions.",
  },
  {
    icon: "🗂️",
    title: "Own dashboard",
    description:
      "FoodMate provides an intuitive interface to easily manage your restaurants.",
  },
  {
    icon: <Icons.qrCode className="mx-auto h-[60px] w-[60px] sm:mx-0" />,
    title: "QR code",
    description:
      "Generate a QR code, print and share it by simply placing it on your restaurant tables.",
  },
  {
    icon: "🌗",
    title: "Dark and Light themes",
    description:
      "Allow users to switch between a visually pleasing dark theme and a light theme in the app",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      <div className="container space-y-4">
        <div className="mx-auto flex flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 lg:max-w-[650px]">
            FoodMate has several awesome features that makes it perfect to take
            your restaurant&apos;s menu to the next level
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              className="relative overflow-hidden rounded-lg border bg-background p-2 text-center sm:text-left"
            >
              <div className="flex flex-col justify-between gap-2 rounded-md p-6">
                <span className="text-[2.5rem]">{icon}</span>
                <div className="space-y-2">
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
