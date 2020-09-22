from data_layer.models.base import Base
import sqlalchemy as sql


class Notes(Base):
    __tablename__ = "notes"
    id = sql.Column(sql.String, primary_key=True)
    title = sql.Column(sql.String)
    description = sql.Column(sql.Text)
    user_id = sql.Column(sql.String, sql.ForeignKey("users.id"))

    def __repr__(self):
        return f"<Note (id={self.id}, title={self.title})>"

