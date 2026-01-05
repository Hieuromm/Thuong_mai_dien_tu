from sqlalchemy import create_engine
import os


DATABASE_URL = "mysql+pymysql://root:root@127.0.0.1:3306/identity"


engine = create_engine(
    DATABASE_URL,
    pool_recycle=3600,
    pool_pre_ping=True
)

def get_engine():
    return engine