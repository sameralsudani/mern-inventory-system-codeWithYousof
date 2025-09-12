import { Form } from "../form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    name: z.string().nonempty("name is required"),
    category: z.string().nonempty("category is required"),
    supplier: z.string().nonempty("supplier is required"),
    price: z.string().nonempty("price is required"),
    stock: z.string().nonempty("stock is required"),
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
  categories?: { _id: string; name: string }[];
  suppliers?: { _id: string; name: string }[];
  product?: Partial<
    RestaurantFormData & {
      _id: string;
      category?: string | { _id: string; name: string };
      supplier?: string | { _id: string; name: string };
    }
  >;
}

const EditProductForm = ({
  onClose,
  categories = [],
  suppliers = [],
  product,
}: AddProductFormProps) => {
  const { language } = useLanguage(); // <-- get current language
  const t = (key: keyof typeof translations["en"]) =>
    translations[language][key] || key;

  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      category:
        typeof product?.category === "string"
          ? product.category
          : product?.category &&
            typeof product.category === "object" &&
            "_id" in product.category
          ? (product.category as { _id: string })._id
          : "",
      supplier:
        typeof product?.supplier === "string"
          ? product.supplier
          : product?.supplier &&
            typeof product.supplier === "object" &&
            "_id" in product.supplier
          ? (product.supplier as { _id: string })._id
          : "",
      price: product?.price ? String(product.price) : "",
      stock: product?.stock ? String(product.stock) : "",
      imageUrl: product?.imageUrl || "",
    },
    resolver: zodResolver(formSchema),
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
    } else if (formDataJson.imageUrl) {
      formData.append("imageUrl", formDataJson.imageUrl);
    }

    const token = localStorage.getItem("ims_token");
    const response = await axiosInstance.put(
      `/products/${product?._id || ""}`,
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
    <div className="fixed inset-0 flex items-center justify-center  from-green-100 via-white to-blue-100 z-50">
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
          <DetailsSection
            categories={categories}
            suppliers={suppliers}
            t={t}
          />
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

export default EditProductForm;
