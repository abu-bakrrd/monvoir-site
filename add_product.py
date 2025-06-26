#!/usr/bin/env python3
"""
Скрипт для добавления товаров в Premium Store
Запуск: python add_product.py
"""

import os
import sys
from datetime import datetime

# Добавляем текущую директорию в path для импорта модулей
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Product

def get_input(prompt, required=True, input_type=str):
    """Получение ввода от пользователя с валидацией"""
    while True:
        try:
            value = input(f"{prompt}: ").strip()
            
            if required and not value:
                print("❌ Это поле обязательно для заполнения!")
                continue
                
            if input_type == float:
                return float(value) if value else None
            elif input_type == int:
                return int(value) if value else None
            else:
                return value if value else None
                
        except ValueError:
            print(f"❌ Неверный формат! Ожидается {input_type.__name__}")
        except KeyboardInterrupt:
            print("\n\n👋 Отменено пользователем")
            sys.exit(0)

def choose_category():
    """Выбор категории из списка"""
    from app import app
    from models import Category
    
    with app.app_context():
        categories = Category.query.all()
    
    if not categories:
        print("❌ В системе нет категорий. Создайте категорию сначала.")
        return None
    
    print("\n📂 Выберите категорию:")
    for i, category in enumerate(categories, 1):
        print(f"  {i}. {category.name}")
    
    print(f"  {len(categories) + 1}. + Добавить новую категорию")
    
    while True:
        try:
            choice = int(get_input("Введите номер категории", required=True))
            if 1 <= choice <= len(categories):
                return categories[choice - 1].name
            elif choice == len(categories) + 1:
                return add_new_category()
            else:
                print(f"❌ Введите число от 1 до {len(categories) + 1}")
        except ValueError:
            print("❌ Введите корректный номер")

def choose_color():
    """Выбор цвета из списка"""
    colors = {
        "1": ("black", "Черный"),
        "2": ("white", "Белый"),
        "3": ("brown", "Коричневый"),
        "4": ("beige", "Бежевый"),
        "5": ("gray", "Серый"),
        "6": ("blue", "Синий"),
        "7": ("green", "Зеленый"),
        "8": ("red", "Красный"),
        "0": (None, "Не указан")
    }
    
    print("\n🎨 Доступные цвета:")
    for key, (_, name) in colors.items():
        print(f"  {key}. {name}")
    
    while True:
        try:
            choice = input("\nВыберите номер цвета: ").strip()
            
            if choice in colors:
                return colors[choice][0]
            else:
                print("❌ Неверный номер цвета!")
                
        except KeyboardInterrupt:
            print("\n\n👋 Отменено пользователем")
            sys.exit(0)

def add_product():
    """Основная функция добавления товара"""
    print("🛍️  PREMIUM STORE - Добавление товара")
    print("=" * 50)
    
    # Сбор информации о товаре
    name = get_input("📝 Название товара", required=True)
    price = get_input("💰 Цена (сум)", required=True, input_type=float)
    
    if price <= 0:
        print("❌ Цена должна быть больше нуля!")
        return False
    
    category = choose_category()
    color = choose_color()
    description = get_input("📄 Описание товара", required=True)
    image_url = get_input("🖼️  URL основного изображения (необязательно)", required=False)
    
    # Сбор дополнительных изображений
    gallery_images = []
    print("\n📸 Дополнительные изображения (нажмите Enter для пропуска):")
    for i in range(5):  # Максимум 5 дополнительных изображений
        additional_url = get_input(f"   URL изображения {i+1}", required=False)
        if additional_url:
            gallery_images.append(additional_url)
        else:
            break
    
    # Если URL не указан, используем placeholder
    if not image_url:
        image_url = "https://via.placeholder.com/400x500/D1BFA3/8C735B?text=Товар"
    
    # Подтверждение данных
    print("\n" + "=" * 50)
    print("📋 ПОДТВЕРЖДЕНИЕ ДАННЫХ:")
    print("=" * 50)
    print(f"Название: {name}")
    print(f"Цена: {price:,.0f} сум")
    print(f"Категория: {category}")
    print(f"Цвет: {color or 'Не указан'}")
    print(f"Описание: {description}")
    print(f"Основное изображение: {image_url}")
    if gallery_images:
        print("Дополнительные изображения:")
        for i, img_url in enumerate(gallery_images, 1):
            print(f"  {i}. {img_url}")
    print("=" * 50)
    
    confirm = input("\n✅ Сохранить товар? (y/n): ").strip().lower()
    
    if confirm not in ['y', 'yes', 'да', 'д']:
        print("❌ Товар не сохранен")
        return False
    
    # Сохранение в базу данных
    try:
        import json
        
        with app.app_context():
            product = Product(
                name=name,
                price=price,
                category=category,
                color=color,
                description=description,
                image_url=image_url,
                image_gallery=json.dumps(gallery_images) if gallery_images else None
            )
            
            db.session.add(product)
            db.session.commit()
            
            print(f"\n✅ Товар '{name}' успешно добавлен!")
            print(f"🆔 ID товара: {product.id}")
            return True
            
    except Exception as e:
        print(f"\n❌ Ошибка при сохранении: {e}")
        return False

def add_new_category():
    """Добавление новой категории"""
    from app import app
    from models import Category, db
    
    print("\n📂 ДОБАВЛЕНИЕ НОВОЙ КАТЕГОРИИ")
    print("=" * 40)
    
    name = get_input("📝 Название категории", required=True)
    description = get_input("📄 Описание категории (необязательно)", required=False)
    
    try:
        with app.app_context():
            # Проверяем, что категория с таким именем не существует
            existing = Category.query.filter_by(name=name).first()
            if existing:
                print(f"❌ Категория '{name}' уже существует!")
                return None
            
            category = Category(name=name, description=description)
            db.session.add(category)
            db.session.commit()
            
            print(f"✅ Категория '{name}' успешно добавлена!")
            return name
            
    except Exception as e:
        print(f"❌ Ошибка при добавлении категории: {e}")
        return None

def manage_categories():
    """Управление категориями"""
    from app import app
    from models import Category, db
    
    while True:
        print("\n📂 УПРАВЛЕНИЕ КАТЕГОРИЯМИ")
        print("=" * 40)
        print("1. Просмотреть все категории")
        print("2. Добавить новую категорию")
        print("3. Вернуться в главное меню")
        
        choice = get_input("Выберите действие", required=True)
        
        if choice == "1":
            with app.app_context():
                categories = Category.query.all()
                if categories:
                    print("\n📋 СПИСОК КАТЕГОРИЙ:")
                    print("-" * 30)
                    for cat in categories:
                        print(f"• {cat.name}")
                        if cat.description:
                            print(f"  {cat.description}")
                        print(f"  Товаров: {len(cat.products)}")
                        print()
                else:
                    print("❌ Категории не найдены")
                    
        elif choice == "2":
            add_new_category()
            
        elif choice == "3":
            break
        else:
            print("❌ Неверный выбор")


def delete_product():
    """Удаление товара по ID с предварительным выводом списка"""
    from models import Product

    with app.app_context():
        products = Product.query.all()
        if not products:
            print("❌ Товары не найдены")
            return

        print("\n📋 СПИСОК ТОВАРОВ:")
        for prod in products:
            print(f"  ID {prod.id}: {prod.name} — {prod.price:,.0f} сум")

        product_id = get_input("\nВведите ID товара для удаления", input_type=int)
        product = Product.query.get(product_id)

        if not product:
            print(f"❌ Товар с ID {product_id} не найден")
            return

        confirm = input(f"❗ Удалить товар '{product.name}'? (y/n): ").strip().lower()
        if confirm in ['y', 'yes', 'д', 'да']:
            db.session.delete(product)
            db.session.commit()
            print("✅ Товар удалён")
        else:
            print("❌ Отменено")



def delete_category():
    """Удаление категории по ID с предварительным выводом списка"""
    from models import Category

    with app.app_context():
        categories = Category.query.all()
        if not categories:
            print("❌ Категорий нет")
            return

        print("\n📂 СПИСОК КАТЕГОРИЙ:")
        for cat in categories:
            print(f"  ID {cat.id}: {cat.name} ({len(cat.products)} товаров)")

        cat_id = get_input("\nВведите ID категории для удаления", input_type=int)
        category = Category.query.get(cat_id)

        if not category:
            print(f"❌ Категория с ID {cat_id} не найдена")
            return

        if category.products:
            print(f"❗ В категории есть {len(category.products)} товаров. Удалите их сначала.")
            return

        confirm = input(f"❗ Удалить категорию '{category.name}'? (y/n): ").strip().lower()
        if confirm in ['y', 'yes', 'д', 'да']:
            db.session.delete(category)
            db.session.commit()
            print("✅ Категория удалена")
        else:
            print("❌ Отменено")


def main():
    """Главная функция"""
    while True:
        print("\n🏪 PREMIUM STORE - ПАНЕЛЬ АДМИНИСТРАТОРА")
        print("=" * 50)
        print("1. Добавить товар")
        print("2. Управление категориями")
        print("3. Удалить товар")
        print("4. Удалить категорию")
        print("5. Выход")

        
        choice = get_input("Выберите действие", required=True)
        
        if choice == "1":
            if add_product():
                print("\n🎉 Товар успешно добавлен в магазин!")
            else:
                print("\n❌ Не удалось добавить товар")
                
        elif choice == "2":
            manage_categories()
            
        elif choice == "3":
            delete_product()
        elif choice == "4":
            delete_category()
        elif choice == "5":
            print("\n👋 До свидания!")
            break
        else:
            print("❌ Неверный выбор")

if __name__ == "__main__":
    main()