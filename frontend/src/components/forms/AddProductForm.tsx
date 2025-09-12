import { Form } from "../form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DetailsSection from "../DetailsSection";
import ImageSection from "../ImageSection";
import { Button } from "../button";
import axiosInstance from "../../utils/api";
import toast from "react-hot-toast";
import { useLanguage } from "../../context/LanguageContext"; // <-- import your language context

const translations = {
  en: {
    addProduct: "Add Product",
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
    name: z.string().nonempty(translations.en.nameRequired),
    category: z.string().nonempty(translations.en.categoryRequired),
    supplier: z.string().nonempty(translations.en.supplierRequired),
    price: z.string().nonempty(translations.en.priceRequired),
    stock: z.string().nonempty(translations.en.stockRequired),
    imageUrl: z.string().optional(),
    imageFile: z
      .instanceof(File, { message: translations.en.imageRequired })
      .optional(),
  })
  .refine((data) => data.imageUrl || data.imageFile, {
    message: translations.en.imageRequired,
    path: ["imageFile"],
  });

type RestaurantFormData = z.infer<typeof formSchema>;

interface AddProductFormProps {
  onClose?: () => void;
  categories?: { _id: string; name: string }[];
  suppliers?: { _id: string; name: string }[];
  product?: Partial<RestaurantFormData & { _id: string }>;
}

const AddProductForm = ({
  onClose,
  categories = [],
  suppliers = [],
  product,
}: AddProductFormProps) => {
  const { language } = useLanguage(); // <-- get current language
  const t = (key: keyof (typeof translations)["en"]) =>
    translations[language][key] || key;

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      supplier: product?.supplier || "",
      price: product?.price || "",
      stock: product?.stock || "",
      imageUrl: product?.imageUrl || "",
    },
    resolver: undefined, // If you use zodResolver, pass it here
  });

  const onSubmit = async (formDataJson: RestaurantFormData) => {
    const formData = new FormData();

    formData.append("name", formDataJson.name);
    formData.append("category", formDataJson.category);
    formData.append("supplier", formDataJson.supplier);
    formData.append("price", formDataJson.price);
    formData.append("stock", formDataJson.stock);

    if (formDataJson.imageFile) {
      formData.append(`imageFile`, formDataJson.imageFile);
    }

    const token = localStorage.getItem("ims_token");
    const response = await axiosInstance.post("/products/add", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 400) {
      toast.error(t("productFailed"));
      throw new Error(t("productFailed"));
    }

    toast.success(product?._id ? t("productUpdated") : t("productAdded"));
    if (onClose) onClose();

    return response?.data;
  };

  const handleClose = () => {
    form.reset();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center from-green-100 via-white to-blue-100 z-50">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl max-w-lg w-full mx-auto shadow-2xl border border-gray-100"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl transition-colors duration-150"
            aria-label={t("close")}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {product?._id ? t("updateProduct") : t("addProduct")}
          </h2>
          <DetailsSection categories={categories} suppliers={suppliers} t={t} />
          <ImageSection product={product} t={t} />
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-20 py-3 rounded-xl font-semibold shadow-lg transition-all duration-150"
            >
              {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddProductForm;
