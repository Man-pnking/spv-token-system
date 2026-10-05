-- ============================================================
-- SPV Chat — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique not null,
  username text unique not null,
  bio text default '',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint username_format check (username ~ '^[a-z0-9_]{3,20}$')
);

create index if not exists users_wallet_idx on public.users (lower(wallet_address));
create index if not exists users_username_idx on public.users (lower(username));

-- ============================================================
-- POSTS (public feed)
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.posts(id) on delete cascade,
  image_url text,
  created_at timestamptz default now(),

  constraint content_length check (char_length(content) between 1 and 500)
);

create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists posts_author_idx on public.posts (author_id);
create index if not exists posts_parent_idx on public.posts (parent_id) where parent_id is not null;

-- ============================================================
-- LIKES
-- ============================================================
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamptz default now(),

  unique (user_id, post_id)
);

create index if not exists likes_post_idx on public.likes (post_id);
create index if not exists likes_user_idx on public.likes (user_id);

-- ============================================================
-- FOLLOWS
-- ============================================================
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references public.users(id) on delete cascade not null,
  following_id uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now(),

  unique (follower_id, following_id),
  check (follower_id != following_id)
);

create index if not exists follows_follower_idx on public.follows (follower_id);
create index if not exists follows_following_idx on public.follows (following_id);

-- ============================================================
-- CONVERSATIONS (1-on-1 direct messages)
-- ============================================================
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references public.users(id) on delete cascade not null,
  user_b uuid references public.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  last_message_at timestamptz default now(),

  unique (user_a, user_b),
  check (user_a < user_b)
);

create index if not exists conversations_user_a_idx on public.conversations (user_a);
create index if not exists conversations_user_b_idx on public.conversations (user_b);
create index if not exists conversations_last_msg_idx on public.conversations (last_message_at desc);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  image_url text,
  read_at timestamptz,
  created_at timestamptz default now(),

  constraint message_length check (char_length(content) between 1 and 2000)
);

create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at desc);
create index if not exists messages_sender_idx on public.messages (sender_id);

-- ============================================================
-- TIPS (off-chain ledger of SPV tips sent in chats/posts)
-- ============================================================
create table if not exists public.tips (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.users(id) on delete cascade not null,
  recipient_id uuid references public.users(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  amount_wei text not null,
  tx_hash text,
  created_at timestamptz default now(),

  check (sender_id != recipient_id)
);

create index if not exists tips_recipient_idx on public.tips (recipient_id);
create index if not exists tips_sender_idx on public.tips (sender_id);

-- ============================================================
-- TRIGGER: bump conversations.last_message_at on new message
-- ============================================================
create or replace function public.bump_conversation_timestamp()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_bump_conversation on public.messages;
create trigger trg_bump_conversation
after insert on public.messages
for each row execute function public.bump_conversation_timestamp();

-- ============================================================
-- TRIGGER: updated_at on users
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();