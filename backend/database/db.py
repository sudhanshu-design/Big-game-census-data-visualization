from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Determine absolute path to census.db in the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "census.db")

# Fallback to SQLite for development if POSTGRES_URL is not provided
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class CensusData(Base):
    __tablename__ = "census_data"

    id = Column(Integer, primary_key=True, index=True)
    district_code = Column(Integer)
    state_name = Column(String, index=True)
    district_name = Column(String, index=True)
    population = Column(Integer)
    male = Column(Integer)
    female = Column(Integer)
    literate = Column(Integer)
    literacy_rate = Column(Float)
    sex_ratio = Column(Float)
    urban_percentage = Column(Float)
    sc_population = Column(Integer)
    st_population = Column(Integer)
    workers = Column(Integer)
    non_workers = Column(Integer)
    # Add more columns as needed based on the 121 columns found
    # For now, let's keep it focused on the main KPIs

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
