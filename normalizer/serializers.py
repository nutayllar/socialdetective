from rest_framework import serializers
from .models import NormalizedPost

class NormalizedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalizedPost
        fields = '__all__'
