import Image from "next/image";
import { useState } from "react";
import { IPost } from "../types/dashboard";

type Props = {
  children: React.ReactNode;
  post: IPost;
};

export default function PopupPrevew({ children, post }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <button
              className="text-gray-500 hover:text-gray-700 float-right"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-center">
              {post.title}
            </h2>

            {/* Image */}
            <div className="flex justify-center">
              <Image
                src={post.image_url}
                alt={post.title}
                className={`object-cover rounded-lg ${
                  post.status === "inappropriate_detected" || post.status === "rejected"
                    ? "blur-sm"
                    : ""
                }`}
                width={384}
                height={288}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
