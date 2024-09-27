"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PopupCreatePost from "../../components/PopupCreatePost";
import PopupPrevew from "../../components/PopupPreview";
import { IPost, IPostResponse } from "@/app/types/dashboard";
import PopupChangeStatus from "@/app/components/PopupChangeStatus";
import { apiCall, convertTimestamp } from "@/app/utils/common";

export default function Dashboard() {

  const [posts, setPost] = useState<IPost[] | null>(null);

  const getPosts = async () => {
    const params = {
      page: "1",
      pageSize: "100",
      orderBy: "created_at",
      sortOrder: "ASC",
    };
    const queryString = new URLSearchParams(params).toString();

    apiCall<IPostResponse>(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/post?${queryString}`
    ).then((response) => {
      if (response?.data) {
        setPost(response?.data?.posts || []);
      } else {
        console.error(response.error);
      }
    });
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Create Post Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold whitespace-nowrap">
          Admin Dashboard
        </h1>
        <PopupCreatePost getPost={getPosts} />
      </div>

      {posts === null ? (
        <>Loading...</>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={index} className="border-t">
                  <td className="py-3 px-4">
                    <PopupPrevew post={post}>
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        width={20}
                        height={20}
                        className="w-16 h-16 rounded-lg cursor-pointer"
                      />
                    </PopupPrevew>
                  </td>
                  <td className="py-3 px-4">{post.title}</td>
                  <td className="py-3 px-4">
                    {convertTimestamp(post.created_at)}
                  </td>
                  <td className="py-3 px-4">
                    <PopupChangeStatus post={post} getPost={getPosts}>
                      <span
                        className={`px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer uppercase ${
                          post.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : post.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {post.status}
                      </span>
                    </PopupChangeStatus>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
