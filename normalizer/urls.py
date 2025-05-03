from django.urls import path
from .views import emergency_demo_view

urlpatterns = [
    path('', emergency_demo_view),
]

