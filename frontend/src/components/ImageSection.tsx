import { useState } from "react";
import { AspectRatio } from "./aspect-ratio";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { useFormContext } from "react-hook-form";
import { assets } from '../assets/assets';

const ImageSection = ({ product, t }) => {
  const { control, watch } = useFormContext();
  const [productImg, setProductImg] = useState(product?.imageUrl || "");
  const existingImageUrl = watch("imageUrl");
  const image = existingImageUrl || productImg || assets.upload_area;

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    TransformFileData(file);
  };

  const TransformFileData = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setProductImg(reader.result);
        } else {
          setProductImg("");
        }
      };
    } else {
      setProductImg("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:w-[50%]">
        <AspectRatio ratio={16 / 9}>
          <img
            src={image || assets.upload_area}
            alt={t("productImageAlt")}
            className="rounded-md object-cover"
            style={{
              maxWidth: "300px",
              maxHeight: "170px",
              width: "100%",
              height: "auto",
            }}
          />
        </AspectRatio>
        <FormField
          control={control}
          name="imageFile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="bg-white"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(event) => {
                    field.onChange(
                      event.target.files ? event.target.files[0] : null
                    );
                    handleProductImageUpload(event);
                  }}
                  placeholder={t("uploadImage")}
                  aria-label={t("uploadImage")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-gray-500">{t("imageHint")}</p>
      </div>
    </div>
  );
};

export default ImageSection;
