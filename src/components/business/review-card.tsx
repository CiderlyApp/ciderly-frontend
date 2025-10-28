// src/components/admin/business/review-card.tsx
import { BusinessReview } from '@/types/entities';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export function ReviewCard({ review }: { review: BusinessReview }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={review.userAvatarUrl ?? undefined} />
          <AvatarFallback>{review.userNickname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md">{review.userNickname}</CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span>{Number(review.ratingValue).toFixed(1)}</span>
            </div>
          </div>
          <CardDescription>
            {new Date(review.createdAt).toLocaleString('ru-RU')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="italic">«{review.commentText || "Без комментария"}»</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Отзыв о: <span className="font-semibold">{review.subjectName}</span> ({review.reviewType})
        </p>
      </CardFooter>
    </Card>
  );
}