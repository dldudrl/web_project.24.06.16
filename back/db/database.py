from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
from core.config import settings



engine = create_engine(settings.DATABASE_URL, echo=True, pool_size=5, max_overflow=10, pool_timeout=60, pool_recycle=3600, pool_pre_ping=False)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()

Base = automap_base()
Base.prepare(autoload_with=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()