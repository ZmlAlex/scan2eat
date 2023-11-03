import { useTranslations } from "next-intl";

import { Icons } from "~/components/Icons";

const features = [
  {
    icon: "🚄",
    title: "featureList.firstFeatureTitle",
    description: "featureList.firstFeatureDescription",
  },
  {
    icon: "🌍",
    title: "featureList.secondFeatureTitle",
    description: "featureList.secondFeatureDescription",
  },
  {
    icon: "🤑",
    title: "featureList.thirdFeatureTitle",
    description: "featureList.thirdFeatureDescription",
  },
  {
    icon: "🗂️",
    title: "featureList.fourthFeatureTitle",
    description: "featureList.fourthFeatureDescription",
  },
  {
    icon: <Icons.qrCode className="mx-auto h-[60px] w-[60px] sm:mx-0" />,
    title: "featureList.fifthFeatureTitle",
    description: "featureList.fifthFeatureDescription",
  },
  {
    icon: "🌗",
    title: "featureList.sixthFeatureTitle",
    description: "featureList.sixthFeatureDescription",
  },
] as const;

export const Features = () => {
  const t = useTranslations("Landing.features");

  return (
    <section
      id="features"
      className="bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      <div className="container space-y-4">
        <div className="mx-auto flex flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-2xl font-medium leading-[1.1] md:text-6xl">
            {t("title")}
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 lg:max-w-[650px]">
            {t("description")}
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
                  <h3 className="font-bold">{t(title)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t(description)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
