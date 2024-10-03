"""Nueva migración para corregir error de migración eliminada

Revision ID: 4c7214c7039e
Revises: 07711c223e8a
Create Date: 2024-10-03 08:32:14.515691

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4c7214c7039e'
down_revision = '07711c223e8a'
branch_labels = None
depends_on = None


def upgrade():
    # Agrega la columna doctor_id como nullable=True temporalmente
    with op.batch_alter_table('dates', schema=None) as batch_op:
        batch_op.add_column(sa.Column('doctor_id', sa.Integer(), nullable=True))

    # Asigna un valor predeterminado a los registros existentes en la tabla dates
    op.execute("UPDATE dates SET doctor_id = 1 WHERE doctor_id IS NULL")

    # Aplica la restricción NOT NULL después de actualizar los registros
    with op.batch_alter_table('dates', schema=None) as batch_op:
        batch_op.alter_column('doctor_id', nullable=False)

    # Crea la clave foránea de la tabla users
    with op.batch_alter_table('dates', schema=None) as batch_op:
        batch_op.create_foreign_key(None, 'users', ['doctor_id'], ['id'])
        batch_op.drop_column('doctor')


def downgrade():
    # Elimina las modificaciones en orden inverso
    with op.batch_alter_table('dates', schema=None) as batch_op:
        batch_op.add_column(sa.Column('doctor', sa.VARCHAR(length=100), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('doctor_id')
