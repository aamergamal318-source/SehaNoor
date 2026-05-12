# SehaNoor

موقع ثابت جاهز للنشر على GitHub Pages.

## النشر على GitHub Pages

1. أنشئ مستودعًا جديدًا على GitHub.
2. اربط هذا المجلد بالمستودع:

```powershell
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USER/YOUR-REPO.git
git push -u origin main
```

3. في GitHub افتح:
   `Settings > Pages > Build and deployment`
4. اختر `GitHub Actions`.

سيتم نشر الموقع تلقائيًا بعد كل رفع إلى فرع `main`.
