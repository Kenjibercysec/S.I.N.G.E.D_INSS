"""adiciona_tabela_opcoes_formulario

Revision ID: 44325abe9fdf
Revises: d9125a2e0e74
Create Date: 2025-06-06 12:43:26.087940

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '44325abe9fdf'
down_revision: Union[str, None] = 'd9125a2e0e74'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # op.alter_column('dispositivos', 'modelo',
    #            existing_type=sa.VARCHAR(length=50),
    #            nullable=False)
    pass


def downgrade() -> None:
    # op.alter_column('dispositivos', 'modelo',
    #            existing_type=sa.VARCHAR(length=50),
    #            nullable=True)
    pass
