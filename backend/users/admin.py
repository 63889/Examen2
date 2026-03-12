# from django import forms
# from django.contrib import admin
# from django.contrib.auth.models import Group
# from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
# from .models import User, ProfilePicture

# # Register your models here.
# try:
#     admin.site.unregister(Group)
# except (LookupError, admin.sites.NotRegistered):
#     pass

# class ProfilePictureInline(admin.TabularInline):
#     model = ProfilePicture
#     fields = ['image_uri']

# class UserAdminForm(forms.ModelForm):
#     class Meta:
#         model = User
#         fields = ['email', 'first_name', 'last_name', 'password', 'role']

#         css = {
#             'all': ('css/admin_site.css')
#         }

# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     form = UserAdminForm

#     fieldsets = [
#         ("User Details", {
#             "fields" : ["email", ("first_name", "last_name"), "password", "role"],
#             "classes" : ["extrapretty"],
#         })
#     ]

#     inlines = [ ProfilePictureInline ]