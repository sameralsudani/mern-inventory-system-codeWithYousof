import { Form } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../button";
import axiosInstance from "../../utils/api";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext"; // <-- import your language context
import CategoryImageSection from "../CategoryImageSection";
import CategoryDetailsSection from "../CategoryDetailsSection";

const translations = {
  en: {
    editCategory: "Edit Category",
    updateProduct: "Update Product",
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
    addProduct: "إضافة منتج",
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
    name: z.string().nonempty("name is required"),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File, { message: "image is required" }).optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: "Either image URL or image File must be provided",
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

interface AddProductFormProps {
  onClose?: () => void;
  category?: any;
}

const EditCategoryForm = ({
  onClose,

  category,
}: AddProductFormProps) => {
  const { language } = useLanguage(); // <-- get current language
  const t = (key: keyof typeof translations["en"]) =>
    translations[language][key] || key;

  const form = useForm({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      imageUrl: category?.imageUrl || "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formDataJson: RestaurantFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("description", formDataJson.description || "");

    if (formDataJson.imageFile) {
      formData.append(`imageFile`, formDataJson.imageFile);
    } else if (formDataJson.imageUrl) {
      formData.append("imageUrl", formDataJson.imageUrl);
    }

    const token = localStorage.getItem("ims_token");
    const response = await axiosInstance.put(
      `/category/${category?._id || ""}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status >= 400) {
      toast.error(t("productFailed"));
      throw new Error(t("productFailed"));
    }

    // Show toast and close modal
    toast.success(t("productUpdated"));
    if (onClose) onClose();

    return response?.data;
  };

  // Wrap your onClose to also reset the form
  const handleClose = () => {
    form.reset(); // <-- clears all fields
    if (onClose) onClose();
  };

  return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl max-w-sm w-full mx-auto shadow-2xl border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {t("editCategory")}
          </h2>
          
          <CategoryDetailsSection
            category={category}
            language={language}
          />
          <CategoryImageSection category={category} language={language} />
         <div className="w-full flex gap-2">
          <Button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow transition-all duration-150"
          >
            {t("submit")}
          </Button>
          <Button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-semibold shadow transition-all duration-150"
          >
            {t("close")}
          </Button>
        </div>
        </form>
      </Form>
  );
};

export default EditCategoryForm;
