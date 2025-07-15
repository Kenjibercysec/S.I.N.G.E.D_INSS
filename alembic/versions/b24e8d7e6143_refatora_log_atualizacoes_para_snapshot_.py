"""Refatora log_atualizacoes para snapshot completo do estado anterior

Revision ID: b24e8d7e6143
Revises: 940449aaaf9b
Create Date: 2025-07-15 08:56:09.649359

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b24e8d7e6143'
down_revision: Union[str, None] = '940449aaaf9b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('log_atualizacoes', 'campo_alterado')
    op.drop_column('log_atualizacoes', 'valor_antigo')
    op.drop_column('log_atualizacoes', 'valor_novo')
    op.add_column('log_atualizacoes', sa.Column('estado_anterior', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('log_atualizacoes', 'estado_anterior')
    op.add_column('log_atualizacoes', sa.Column('campo_alterado', sa.String(length=50), nullable=True))
    op.add_column('log_atualizacoes', sa.Column('valor_antigo', sa.Text(), nullable=True))
    op.add_column('log_atualizacoes', sa.Column('valor_novo', sa.Text(), nullable=True))
