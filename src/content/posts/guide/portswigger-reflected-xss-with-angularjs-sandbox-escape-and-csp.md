---
title: "PortSwigger Expert Lab: Reflected XSS with AngularJS Sandbox Escape and CSP"
published: 2026-03-13
description: "Solving the PortSwigger lab involving AngularJS sandbox escape combined with a CSP restriction."
tags: ["web", "xss", "angularjs", "portswigger", "csp"]
category: "CTFs"
draft: false
---

# Introduction

This lab is a little trickier than the previous AngularJS one because it adds **Content Security Policy (CSP)** into the mix.

Normally, CSP helps prevent inline scripts from running, which blocks many classic XSS payloads. However, AngularJS expressions can sometimes bypass these restrictions if we can make Angular evaluate malicious code inside the page.

So the challenge here is not just triggering XSS — it is doing it **while respecting the CSP restrictions**.

---

# The idea behind the exploit

The key idea is to use the **`ng-focus` event** in AngularJS.

AngularJS allows event directives like:


ng-click
ng-focus
ng-change


These directives execute AngularJS expressions when the event happens.

If we can inject an element with `ng-focus`, we can make Angular execute our expression whenever that element receives focus.

---

# The exploit

# The exploit

On the exploit server, I used the following payload:

```html
<script>
location='https://YOUR-LAB-ID.web-security-academy.net/?search=%3Cinput%20id=x%20ng-focus=$event.composedPath()|orderBy:%27(z=alert)(document.cookie)%27%3E#x';
</script>
```
After storing the exploit and delivering it to the victim, the payload executes.

Understanding the payload

Once decoded, the injected part looks roughly like this:

`<input id=x ng-focus=$event.composedPath()|orderBy:'(z=alert)(document.cookie)'>`

At first glance it looks strange, but each piece has a purpose.

1. Using ng-focus

The payload uses the AngularJS directive:

ng-focus

This means the expression will run whenever the element receives focus.

The URL ends with:

#x

This forces the browser to focus the element with id="x" automatically when the page loads.

So the expression runs immediately.

2. Using $event

AngularJS provides a special variable called:

$event

This represents the event object that triggered the directive.

In this case we access:

```$event.composedPath()```

This returns an array containing all the elements involved in the event propagation.

The interesting part is that the last element of that array is the window object.

3. The orderBy filter trick

Normally in JavaScript the symbol | means bitwise OR, but inside AngularJS expressions it represents a filter.

Here we are using the AngularJS filter:

orderBy

The syntax looks like this:

expression | filter : argument

So in our payload:

```$event.composedPath() | orderBy : '(z=alert)(document.cookie)'``

AngularJS applies the orderBy filter to the array returned by composedPath().

4. Assigning alert to another variable

Instead of calling alert() directly, the payload does this:

```(z = alert)(document.cookie)```

This assigns the alert function to a variable called z.

Later it calls z() with document.cookie.

This small trick helps avoid certain AngularJS checks that try to block direct function calls.

5. Why the payload works

The orderBy filter eventually processes the element in the array that corresponds to the window object.

When the expression is evaluated in that context, our function call executes successfully.

Because the code runs through AngularJS expressions rather than a normal <script> tag, the CSP restriction is bypassed.

As a result, the payload executes:

`alert(document.cookie)`

and the lab is solved.

Exploitation steps

Open the exploit server provided by the lab.


```html
<script>
location='https://YOUR-LAB-ID.web-security-academy.net/?search=%3Cinput%20id=x%20ng-focus=$event.composedPath()|orderBy:%27(z=alert)(document.cookie)%27%3E#x';
</script>
```

Replace YOUR-LAB-ID with your actual lab ID.

Click Store.

Click Deliver exploit to victim.

Once the victim loads the exploit page, the injected AngularJS expression runs and triggers the alert.