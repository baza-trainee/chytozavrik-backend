from django.db import models
from django.utils import timezone

from user_profile.models import Child


class TimeStampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Book(TimeStampMixin):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    cover_image = models.FileField(upload_to="books/")
    is_recommended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.author} {self.title}"


class Quiz(TimeStampMixin):
    book = models.OneToOneField(Book, on_delete=models.CASCADE, related_name="quiz")

    def __str__(self):
        return f'Quiz on the book "{self.book.title}"'


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField(max_length=350)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    text = models.TextField(max_length=350)

    def __str__(self):
        return self.text


class TrueAnswer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.question.text} - Correct Answer: {self.answer.text}"


class QuizReward(models.Model):
    quiz = models.OneToOneField(Quiz, on_delete=models.CASCADE, related_name="reward")
    reward = models.FileField(upload_to="rewards/")

    def __str__(self):
        return f"Reward for  quiz {self.quiz}"


class ChildReward(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    reward = models.ForeignKey(QuizReward, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.reward)


class ChildQuizAttempt(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)
    total_attempts = models.PositiveIntegerField(default=0)
    last_attempt_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.child.name} - {self.quiz} - Score: {self.score} - Total: {self.total_attempts}"
