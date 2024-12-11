export default interface PostDTO {
  postID: string;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
  content: string;
}
