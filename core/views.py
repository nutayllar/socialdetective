from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import torch
from transformers import pipeline
from rest_framework.generics import ListCreateAPIView
from .models import SocialMediaPost, Post
from .serializers import SocialMediaPostSerializer, PostSerializer
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_POST
import json
import re
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import tweepy
import requests
from datetime import datetime




# Load sentiment analysis pipeline
sentiment_pipeline = pipeline("sentiment-analysis")

# Define `AnalyzeTextView`
class AnalyzeTextView(View):
    def post(self, request, *args, **kwargs):
        text = request.POST.get("text", "")
        if text:
            result = sentiment_pipeline(text)
            return JsonResponse(result, safe=False)
        return JsonResponse({"error": "No text provided"}, status=400)

# Define `SocialMediaPostListCreateView`
class SocialMediaPostListCreateView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse({"message": "Fetching social media posts..."})

    def post(self, request, *args, **kwargs):
        return JsonResponse({"message": "Creating a social media post..."})

# Define `home`
def home(request):
    input_text = ""
    normalized_text = ""
    
    if request.method == "POST":
        input_text = request.POST.get("text", "")
        normalized_text = normalize_text(input_text)

    return render(request, "home.html", {
        "input_text": input_text,
        "normalized_text": normalized_text
    })

# Define `analyze_sentiment`
@csrf_exempt
def analyze_sentiment(request):
    if request.method == "POST":
        text = request.POST.get("text", "")
        if text:
            result = sentiment_pipeline(text)
            return JsonResponse(result, safe=False)
        return JsonResponse({"error": "No text provided"}, status=400)
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@require_POST
def normalize_text(request):
    try:
        data = json.loads(request.body)
        text = data.get('text', '')
        normalized_text = ' '.join(text.lower().strip().split())
        return JsonResponse({'normalized_text': normalized_text})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
@csrf_exempt  # Disable CSRF just for testing (we'll secure this later)
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')

            user = authenticate(request, username=email, password=password)

            if user is not None:
                return JsonResponse({'message': 'Login successful', 'role': role})
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=401)
        except Exception as e:
            return JsonResponse({'message': 'Server error', 'error': str(e)}, status=500)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)

# Initialize Twitter API client only if credentials are available
try:
    if all([
        settings.TWITTER_API_KEY,
        settings.TWITTER_API_SECRET,
        settings.TWITTER_ACCESS_TOKEN,
        settings.TWITTER_ACCESS_TOKEN_SECRET
    ]):
        auth = tweepy.OAuthHandler(
            settings.TWITTER_API_KEY,
            settings.TWITTER_API_SECRET
        )
        auth.set_access_token(
            settings.TWITTER_ACCESS_TOKEN,
            settings.TWITTER_ACCESS_TOKEN_SECRET
        )
        twitter_api = tweepy.API(auth)
    else:
        twitter_api = None
except Exception as e:
    print(f"Error initializing Twitter API: {str(e)}")
    twitter_api = None

@api_view(['GET'])
def search_twitter(request):
    if not twitter_api:
        return Response(
            {"error": "Twitter API credentials not configured"},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    query = request.GET.get('q', '')
    if not query:
        return Response(
            {"error": "Search query is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        tweets = twitter_api.search_tweets(q=query, count=10)
        results = [{
            'text': tweet.text,
            'created_at': tweet.created_at,
            'user': tweet.user.screen_name
        } for tweet in tweets]
        return Response(results)
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_social_media(request):
    data = request.data
    platform = data.get('platform', 'twitter')
    username = data.get('username')
    hashtags = data.get('hashtags', '').split(',')
    keywords = data.get('keywords', '').split(',')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    results = []
    if platform == 'twitter':
        try:
            # Search tweets
            query = []
            if username:
                query.append(f'from:{username}')
            if hashtags:
                query.extend([f'#{tag.strip()}' for tag in hashtags if tag.strip()])
            if keywords:
                query.extend([f'"{keyword.strip()}"' for keyword in keywords if keyword.strip()])
            
            search_query = ' '.join(query)
            tweets = twitter_api.search_tweets(
                q=search_query,
                count=100,
                tweet_mode='extended'
            )
            
            results = [{
                'id': tweet.id_str,
                'text': tweet.full_text,
                'created_at': tweet.created_at.isoformat(),
                'user': {
                    'screen_name': tweet.user.screen_name,
                    'name': tweet.user.name
                },
                'platform': 'twitter'
            } for tweet in tweets]
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    elif platform == 'instagram':
        # Instagram API implementation will go here
        pass

    return Response({
        'results': results,
        'metadata': {
            'total_results': len(results),
            'platform': platform,
            'query': {
                'username': username,
                'hashtags': hashtags,
                'keywords': keywords,
                'start_date': start_date,
                'end_date': end_date
            }
        }
    })

class SocialSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get('query', '')
        platform = request.data.get('platform', '').lower()
        posts = Post.objects.all()

        if platform in ['twitter', 'instagram']:
            posts = posts.filter(platform__iexact=platform)
        if query:
            posts = posts.filter(
                text__icontains=query
            )  # You can expand this to search username/hashtags

        serializer = PostSerializer(posts[:50], many=True)  # Limit results
        return Response({'results': serializer.data}, status=status.HTTP_200_OK)

        
        

        
        
