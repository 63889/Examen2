class UserRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'users':
            return 'default'
        return None
    
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'users':
            return 'default'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'users':
            return db == 'default'
        return None
    
class BookCatalogRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'catalog':
            return 'book_catalog'
        return None
    
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'catalog':
            return 'book_catalog'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'catalog':
            return False
        return None

class BookBorrowingRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'borrowing':
            return 'default'
        return None
    
    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'borrowing':
            return 'default'
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'borrowing':
            return db == 'default'
        return None