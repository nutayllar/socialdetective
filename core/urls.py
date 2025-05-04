from django.urls import include, path
from .views import AnalyzeTextView, SocialMediaPostListCreateView
from .views import home, analyze_sentiment
from .views import normalize_text
from . import views
from .views import SocialSearchView



urlpatterns = [
    path('analyze-text/', AnalyzeTextView.as_view(), name='analyze-text'),
    path('social-posts/', SocialMediaPostListCreateView.as_view(), name='social-posts'),
    path("", home, name="home"),
    path("analyze_sentiment/", analyze_sentiment, name="analyze_sentiment"),
    path('api/normalize/', normalize_text, name='normalize_text'),
    path('api/search/twitter/', views.search_twitter, name='search_twitter'),
    path('api/search/', SocialSearchView.as_view(), name='social-search'),
]
