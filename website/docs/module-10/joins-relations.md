---
sidebar_position: 1
title: Joins & Relations
---

# Joins & Relations

## Types of Joins

```sql
-- INNER JOIN — only matching rows from both tables
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON posts.author_id = users.id;

-- LEFT JOIN — all users, even those without posts
SELECT users.name, COUNT(posts.id) AS post_count
FROM users
LEFT JOIN posts ON posts.author_id = users.id
GROUP BY users.id, users.name
ORDER BY post_count DESC;

-- Many-to-many via junction table
SELECT posts.title, tags.name
FROM posts
INNER JOIN post_tags ON post_tags.post_id = posts.id
INNER JOIN tags ON tags.id = post_tags.tag_id
WHERE posts.published = TRUE;
```
