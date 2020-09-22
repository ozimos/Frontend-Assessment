from data_layer.models.base import Base
import sqlalchemy as sql


class Users(Base):
    __tablename__ = "users"
    id = sql.Column(sql.String, primary_key=True)
    username = sql.Column(sql.String, unique=True)

    def __repr__(self):
        return f"<User (id={self.id}, username={self.username})>"

