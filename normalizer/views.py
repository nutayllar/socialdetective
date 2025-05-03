from rest_framework.decorators import api_view
from rest_framework.response import Response
from core.models import SocialMediaPost
from .models import NormalizedPost
from .serializers import NormalizedPostSerializer
import re
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import re

def normalize_text_util(text):  # <- new name
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text.strip()
@api_view(['POST'])
def emergency_demo_view(request):
    post_id = request.data.get('post_id')
    try:
        post = SocialMediaPost.objects.get(id=post_id)
    except SocialMediaPost.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    normalized = normalize_text_util(post.content)
    normalized_post = NormalizedPost.objects.create(original_post=post, normalized_content=normalized)
    serializer = NormalizedPostSerializer(normalized_post)
    return Response(serializer.data)

@csrf_exempt
def normalize_text_view(request):  
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')

            # Example normalization 
            normalized = re.sub(r'\s+', ' ', text).strip().lower()

            return JsonResponse({'normalized_text': normalized})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON!'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)