from django.db import models

class SocialMediaPost(models.Model):
    content = models.TextField()
    platform = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.platform} post at {self.created_at}"


