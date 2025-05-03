from django.db import models
from core.models import SocialMediaPost  # adjust 'main' if your app name is different

class NormalizedPost(models.Model):
    original_post = models.ForeignKey(SocialMediaPost, on_delete=models.CASCADE)
    normalized_content = models.TextField()

    def __str__(self):
        return f"Normalized Post for: {self.original_post.id}"
