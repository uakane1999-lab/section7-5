"""create users and recipes tables

Revision ID: 3ddd48693801
Revises: 
Create Date: 2026-06-02 10:41:01.114664

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3ddd48693801'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('users',
    sa.Column('id', sa.dialects.postgresql.UUID(), nullable=False),
    sa.Column('firebase_uid', sa.String(length=128), nullable=False),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('avatar_url', sa.String(length=500), nullable=True),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('firebase_uid'),
    sa.UniqueConstraint('username'),
    sa.Index('ix_users_firebase_uid', 'firebase_uid')
    )
    op.create_table('recipes',
    sa.Column('id', sa.dialects.postgresql.UUID(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('ingredients', sa.Text(), nullable=False),
    sa.Column('instructions', sa.Text(), nullable=False),
    sa.Column('image_url', sa.String(length=500), nullable=True),
    sa.Column('user_id', sa.dialects.postgresql.UUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.Index('idx_recipes_created_at', 'created_at'),
    sa.Index('idx_recipes_user_id', 'user_id')
    )


def downgrade() -> None:
    op.drop_table('recipes')
    op.drop_table('users')
