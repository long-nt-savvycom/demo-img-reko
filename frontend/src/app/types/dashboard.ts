export enum EPostStatus {
  Open = "open",
  Approved = "approved",
  Rejected = "rejected",
}

export interface IPost {
  id: number;
  image_url: string;
  title: string;
  status: string;
  created_at: string;
  label?: string;
}

export interface IPostResponse {
  posts: IPost[];
  total: number;
}
