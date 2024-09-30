"""empty message

Revision ID: 07711c223e8a
Revises: b84a81b99cc8
Create Date: 2024-09-30 23:04:22.065485

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07711c223e8a'
down_revision = 'b84a81b99cc8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=300), nullable=False),
    sa.Column('last_name', sa.String(length=300), nullable=False),
    sa.Column('document_type', sa.String(length=200), nullable=False),
    sa.Column('document_number', sa.String(length=200), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=False),
    sa.Column('role', sa.String(length=200), nullable=True),
    sa.Column('speciality', sa.String(length=200), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=300), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('dates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor', sa.String(length=100), nullable=False),
    sa.Column('datetime', sa.DateTime(), nullable=False),
    sa.Column('reason_for_appointment', sa.String(length=300), nullable=False),
    sa.Column('date_type', sa.String(length=100), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('weekly_availability',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('day_of_week', sa.Integer(), nullable=False),
    sa.Column('start_time', sa.Time(), nullable=False),
    sa.Column('end_time', sa.Time(), nullable=False),
    sa.ForeignKeyConstraint(['doctor_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('weekly_availability')
    op.drop_table('dates')
    op.drop_table('users')
    # ### end Alembic commands ###
