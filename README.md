# Unified Solutions Inc. Website

Premium leadership coaching website for Julian Johnson — ICF PCC, ACTC Candidate, ExecOnline & Emeritus Faculty.

## Structure

```
/                   Homepage
/about              About Julian Johnson
/coaching           Coaching Services
/resources          Resources & Articles
/book-a-call        Book a Discovery Call
```

## Custom Domain

Domain: `unifiedsolutionsinc.com`
CNAME file included. Point DNS to GitHub Pages per instructions below.

## DNS Setup (Namecheap / GoDaddy / your registrar)

Add these records at your domain registrar:

| Type  | Host | Value |
|-------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | unifiedsolutionsinc.com |

DNS changes take 1-48 hours to propagate.

## Deployment

GitHub Pages serves directly from the `main` branch root.
Settings > Pages > Source: Deploy from branch > `main` > `/ (root)`

---
*Built for Julian Johnson, Unified Solutions Inc.*
