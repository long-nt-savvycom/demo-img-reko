import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { EPostStatus, IPost } from "../types/dashboard";
import { apiCall } from "../utils/common";

type Props = {
  children: React.ReactNode;
  post: IPost;
  getPost: () => void;
};

export default function PopupChangeStatus({ children, post, getPost }: Props) {

  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, setValue } = useForm<{
    status: string;
  }>({
    defaultValues: {
      status: post.status,
    },
  });

  const openPopup = () => {
    setValue(
      "status",
      post.status !== EPostStatus.Open ? post.status : EPostStatus.Approved
    );
    setIsOpen(true);
  };

  // handle submit form
  const onSubmit: SubmitHandler<{ status: string }> = async (data) => {
    const params = {
      status: data.status,
    };

    apiCall<{ status: string }>(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/post/${post.id}`,
      "PATCH",
      JSON.stringify(params),
      {
        "Content-Type": "application/json",
      }
    ).then((response) => {
      if (response.data) {
        getPost();
        setIsOpen(false);
      } else {
        console.error(response.error);
      }
    });
  };

  return (
    <div className="container mx-auto">
      <div onClick={openPopup}>{children}</div>

      {/* Popup modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Change Status for: {post.title}
            </h2>
            {/* Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Select Status
                </label>
                <div className="flex space-x-4">
                  {/* Option Approve */}
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="approved"
                      {...register("status", { required: true })}
                      className="form-radio w-4 h-4"
                    />
                    <span className="ml-2">Approve</span>
                  </label>

                  {/* Option Reject */}
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="rejected"
                      {...register("status", { required: true })}
                      className="form-radio w-4 h-4"
                    />
                    <span className="ml-2">Reject</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
