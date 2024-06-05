export interface Comment {
  answersCount: number;
  allAnswers?: Comment[];
  authorName: string;
  authorPhoto?: string;
  authorUid: string;
  content: string;
  createdAt: string;
  id: string;
  commentId?: string;
  updatedAt?: string;
}
