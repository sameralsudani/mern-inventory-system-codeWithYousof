import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { useFormContext } from "react-hook-form";


type CategoryDetailsSectionProps = {
  language: "en" | "ar";
  category?: { name?: string; description?: string };
};

const translations = {
  en: {
    name: "Name",
    namePlaceholder: "Enter category name",
    description: "Description",
    descriptionPlaceholder: "Enter category description",
  },
  ar: {
    name: "الاسم",
    namePlaceholder: "أدخل اسم الفئة",
    description: "الوصف",
    descriptionPlaceholder: "أدخل وصف الفئة",
  },
};

const CategoryDetailsSection = ({ language, category }: CategoryDetailsSectionProps) => {
  const { control } = useFormContext();
  const t = (key: keyof typeof translations["en"]) => translations[language][key] || key;

  return (
    <div className="space-y-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white"
                placeholder={t("namePlaceholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("description")}</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white"
                placeholder={t("descriptionPlaceholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CategoryDetailsSection;
