import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { useFormContext } from "react-hook-form";

type Category = {
  _id: string;
  name: string;
};

type Supplier = {
  _id: string;
  name: string;
};

type DetailsSectionProps = {
  categories?: Category[];
  suppliers?: Supplier[];
  t: any
};

const DetailsSection = ({
  categories: propCategories = [],
  suppliers: propSuppliers = [],
  t,
}: DetailsSectionProps) => {
  const { control } = useFormContext();
  const categories = propCategories.map((c) => ({
    value: c._id,
    label: c.name,
  }));
  if (categories.length > 0) {
    categories.unshift({ value: "", label: t("selectCategory") });
  }

  const suppliers = propSuppliers.map((s) => ({
    value: s._id,
    label: s.name,
  }));
  if (suppliers.length > 0) {
    suppliers.unshift({ value: "", label: t("selectSupplier") });
  }

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
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("category")}</FormLabel>
            <FormControl>
              <select
                {...field}
                className="bg-white border rounded px-3 py-2 w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supplier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("supplier")}</FormLabel>
            <FormControl>
              <select
                {...field}
                className="bg-white border rounded px-3 py-2 w-full"
              >
                {suppliers.map((sup) => (
                  <option key={sup.value} value={sup.value}>
                    {sup.label}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("price")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                className="bg-white"
                placeholder={t("pricePlaceholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("stock")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                className="bg-white"
                placeholder={t("stockPlaceholder")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DetailsSection;
