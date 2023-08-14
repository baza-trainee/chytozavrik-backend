from django.db import models
from user_profile.models import Child


class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    cover_image = models.ImageField(upload_to='books/')

    def __str__(self):
        return f'{self.author} {self.title}'


class RecommendationBook(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='recommendations')

    def __str__(self):
        return f'Recommend {self.book.title}'


class Quiz(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='quizzes')

    def __str__(self):
        return f'Quiz on the book "{self.book.title}"'


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField(max_length=350)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField(max_length=350)

    def __str__(self):
        return self.text


class TrueAnswer(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.question.text} - Correct Answer: {self.answer.text}"


class QuizReward(models.Model):
    quiz = models.OneToOneField(Quiz, on_delete=models.CASCADE, related_name='reward')
    reward = models.ImageField(upload_to='rewards/')

    def __str__(self):
        return f"Reward for  quiz {self.quiz}"


class ChildReward(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    reward = models.ForeignKey(QuizReward, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)

    def __str__(self):
        return self.reward


class ChildQuizAttempt(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.child.name} - {self.quiz} - Score: {self.score}"

