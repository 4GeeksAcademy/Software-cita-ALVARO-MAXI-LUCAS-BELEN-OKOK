"""merge heads

Revision ID: 441db522cd1b
Revises: 1bc1b35c6931, 3046ec345533, 79dbc4b3652c
Create Date: 2024-09-16 18:06:33.608987

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '441db522cd1b'
down_revision = ('1bc1b35c6931', '3046ec345533', '79dbc4b3652c')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
