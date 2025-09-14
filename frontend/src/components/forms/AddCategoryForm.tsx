import { Form } from "../form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../button";
import axiosInstance from "../../utils/api";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext"; // <-- import your language context
import CategoryDetailsSection from "../CategoryDetailsSection";
import CategoryImageSection from "../CategoryImageSection";

const translations = {
  en: {
    addCategory: "Add New Category",
    updateCategory: "Update Category",
    nameRequired: "Name is required",
    categoryRequired: "Category is required",
    supplierRequired: "Supplier is required",
    priceRequired: "Price is required",
    stockRequired: "Stock is required",
    imageRequired: "Image is required",
    submit: "Submit",
    productAdded: "Product added successfully!",
    productUpdated: "Product updated successfully!",
    productFailed: "Failed to create product",
    categoryFailed: "Failed to create category",
    close: "Close",
    name: "Name",
    namePlaceholder: "Enter product name",
    category: "Category",
    selectCategory: "Select a category",
    supplier: "Supplier",
    selectSupplier: "Select a supplier",
    price: "Price",
    pricePlaceholder: "Enter price",
    stock: "Stock",
    stockPlaceholder: "Enter stock quantity",
    productImageAlt: "Product image",
    uploadImage: "Upload image",
    imageHint: "Accepted formats: jpg, jpeg, png",
  },
  ar: {
    addCategory: "إضافة منتج",
    updateProduct: "تحديث المنتج",
    nameRequired: "الاسم مطلوب",
    categoryRequired: "الفئة مطلوبة",
    supplierRequired: "المورد مطلوب",
    priceRequired: "السعر مطلوب",
    stockRequired: "المخزون مطلوب",
    imageRequired: "الصورة مطلوبة",
    submit: "إرسال",
    productAdded: "تمت إضافة المنتج بنجاح!",
    productUpdated: "تم تحديث المنتج بنجاح!",
    productFailed: "فشل في إنشاء المنتج",
    categoryFailed: "فشل في إنشاء الفئة",
    close: "إغلاق",
    name: "الاسم",
    namePlaceholder: "أدخل اسم المنتج",
    category: "الفئة",
    selectCategory: "اختر الفئة",
    supplier: "المورد",
    selectSupplier: "اختر المورد",
    price: "السعر",
    pricePlaceholder: "أدخل السعر",
    stock: "المخزون",
    stockPlaceholder: "أدخل الكمية",
    productImageAlt: "صورة المنتج",
    uploadImage: "رفع صورة",
    imageHint: "الصيغ المقبولة: jpg, jpeg, png",
  },
};

const formSchema = z
  .object({
    name: z.string().nonempty(translations.en.nameRequired),
    description: z.string().nonempty(translations.en.nameRequired),
    imageUrl: z.string().optional(),
    imageFile: z
      .instanceof(File, { message: translations.en.imageRequired })
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: translations.en.imageRequired,
    path: ["imageFile"],
  });

type CategoryFormData = z.infer<typeof formSchema>;

interface AddCategoryFormProps {
  onClose?: () => void;
  category?: Partial<CategoryFormData & { _id: string }> | null;
}

const AddCategoryForm = ({
  onClose,
  category,
}: AddCategoryFormProps) => {
  const { language } = useLanguage(); // <-- get current language
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key] || key;

  const form = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      imageUrl: category?.imageUrl || "",
    },
    resolver: undefined, // If you use zodResolver, pass it here
  });

  const onSubmit = async (formDataJson: CategoryFormData) => {
    const formData = new FormData();

    formData.append("name", formDataJson.name);
    formData.append("description", formDataJson.description);

    if (formDataJson.imageFile) {
      formData.append(`imageFile`, formDataJson.imageFile);
    }

    const token = localStorage.getItem("ims_token");
    const response = await axiosInstance.post("/category/add", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 400) {
      toast.error(t("categoryFailed"));
      throw new Error(t("categoryFailed"));
    }

    toast.success(category?._id ? t("updateCategory") : t("addCategory"));
    if (onClose) onClose();

    return response?.data;
  };

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl max-w-sm w-full mx-auto shadow-2xl border border-gray-100"
        >
        
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {t("addCategory")}
          </h2>
          <CategoryDetailsSection language={language} />
          <CategoryImageSection category={category} language={language} />
          <div className="w-full">
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow transition-all duration-150"
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
  );
};

export default AddCategoryForm;
