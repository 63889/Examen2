from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        super().ready()
        from django.contrib import admin
        try:
            from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
            models_to_unregister = [OutstandingToken, BlacklistedToken]
        except:
            models_to_unregister = []
        
        for model in models_to_unregister:
            try:
                admin.site.unregister(model)
            except:
                pass