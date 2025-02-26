# **Next.js TypeScript Project**

A full-stack **Next.js** application with **TypeScript** , **Clerk authentication** , **MongoDB** , **Stripe payments** , and **Cloudinary** for media uploads.

## **🚀 Setup Instructions**

### **1️⃣ Install Dependencies**

```sh
npm install  # or yarn install
```

### **2️⃣ Configure Environment Variables**

Create a **`.env.local`** file in your project root and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
MONGODB_URI=your-mongodb-uri
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

L[c]()ogin to clerk,stripe, claudinary and get your credetials please

### **3️⃣ Run the Development Server**

```sh
npm run dev  # or yarn dev
```

## **🛠️ Tech Stack**

- **Next.js 15** (Full-stack framework)
- **TypeScript** (Static typing)
- **Clerk** (Authentication)
- **MongoDB + Mongoose** (Database)
- **Stripe** (Payments)
- **Cloudinary** (File uploads)
- **Tailwind CSS** (Styling)

## **🧪 Testing**

- **Jest** → Unit tests (`npm test`)
- **Cypress** → End-to-end tests (`npx cypress open`)

## **🚀 Deployment**

Host on **Vercel** :

1. Push code to **GitHub** .
2. Import repo in **Vercel** .
3. Set **environment variables** .
4. Click **Deploy** .

   Need help
   Open an issue on github Or contact me L[inkedIn](https://www.linkedin.com/in/tilahun-goitom-559401302/ "tilahun@LinkedIn")

---

🎉 **Happy Coding!** 🚀
