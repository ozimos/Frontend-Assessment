"""added author_id column

Revision ID: 367c1a811719
Revises: 6acb1ecec167
Create Date: 2020-09-08 12:43:43.535906

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '367c1a811719'
down_revision = '6acb1ecec167'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('notes', sa.Column('author_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'notes', 'users', ['author_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'notes', type_='foreignkey')
    op.drop_column('notes', 'author_id')
    # ### end Alembic commands ###