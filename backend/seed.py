"""Seed script: creates tables and inserts sample admin user + charities."""
from database import engine, Base, SessionLocal
from models import User, Charity
from auth import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ── Admin user ───────────────────────────────
    admin = db.query(User).filter(User.email == "admin@golf.com").first()
    if not admin:
        admin = User(
            name="Admin",
            email="admin@golf.com",
            password_hash=hash_password("admin123"),
            role="admin",
            subscription_type="yearly",
            subscription_status="active",
        )
        db.add(admin)
        print("✅ Admin user created (admin@golf.com / admin123)")
    else:
        print("ℹ️  Admin user already exists")

    # ── Sample charities ─────────────────────────
    charities_data = [
        {
            "name": "First Tee Foundation",
            "description": "Introducing golf to young people to build character and life skills.",
            "image": "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400",
        },
        {
            "name": "Golf Fore Africa",
            "description": "Providing clean water and education to communities in Africa.",
            "image": "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400",
        },
        {
            "name": "Birdies for the Brave",
            "description": "Supporting military families through golf events and programs.",
            "image": "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400",
        },
        {
            "name": "The Green Project",
            "description": "Making golf courses environmentally sustainable worldwide.",
            "image": "https://images.unsplash.com/photo-1600005082732-519cd109c43d?w=400",
        },
        {
            "name": "Junior Golf Alliance",
            "description": "Scholarships and training for junior golfers from underserved communities.",
            "image": "https://images.unsplash.com/photo-1622819584099-e04ccb14e8a7?w=400",
        },
    ]

    existing = db.query(Charity).count()
    if existing == 0:
        for c in charities_data:
            db.add(Charity(**c))
        print("✅ 5 sample charities created")
    else:
        print(f"ℹ️  {existing} charities already exist")

    db.commit()
    db.close()
    print("🎉 Seed complete!")


if __name__ == "__main__":
    seed()
