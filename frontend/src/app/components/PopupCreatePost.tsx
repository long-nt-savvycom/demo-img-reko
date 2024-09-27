import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { apiCall } from "../utils/common";
import { IPost } from "../types/dashboard";

type PostFormInputs = {
  title: string;
  image: FileList;
};

type Props = {
  getPost: () => void;
};

export default function PopupCreatePost({ getPost }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PostFormInputs>();

  // handle submit form
  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    if (data.image && data.image[0]) {
      const file = data.image[0];

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("file", file);

      apiCall<IPost>(
        `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/post`,
        "POST",
        formData
      ).then((response) => {
        if (response.data) {
          getPost();
          setIsOpen(false);
          reset();
        } else {
          console.error(response.error);
        }
      });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setIsOpen(true)}
        >
          Create Post
        </button>
      </div>

      {/* Popup modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Title Field */}
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 ${
                    errors.title ? "border-red-500" : "focus:ring-blue-400"
                  }`}
                  placeholder="Enter post title"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Image Upload Field */}
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="image"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 ${
                    errors.image ? "border-red-500" : "focus:ring-blue-400"
                  }`}
                  accept="image/*"
                  {...register("image", {
                    required: "Image is required",
                    validate: {
                      lessThan2MB: (files) => {
                        const file = files[0];
                        return (
                          file?.size / 1024 / 1024 <= 2 ||
                          "File must be smaller than 2MB"
                        );
                      },
                      checkImageType: (files) => {
                        const file = files[0];
                        console.log("123123", file);
                        return (
                          file?.type.startsWith("image/") ||
                          "File must be an image"
                        );
                      },
                    },
                  })}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
