<template>
    <div class="landing">   
      <section class="hero">
        <div class="hero-text">
          <h1>Empowering Institutions with Smart Learning, Teaching &<br />Management Tools</h1>
          <p>
            A next-generation EdTech ecosystem that seamlessly integrates smart classrooms,
            institutional management, and data-driven insights to elevate learning outcomes.
          </p>
          <div class="hero-buttons">
            <button class="login-btn" @click="goToLogin">Login</button>
          </div>
        </div>
        <div class="hero-image">
          <img :src="schoolImage" alt="School Illustration" />
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import schoolImage from '@/assets/images/school3.png'; // adjust extension if it's .jpg/.svg
  
  const router = useRouter();
  
  const goToLogin = () => {
    router.push('/login1');
  };
  </script>
  
  
  <style scoped>
 .landing {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #b6e4f7;
  padding: 2rem;
}

.hero {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  gap: 2rem;
}

.hero-text {
  flex: 1;
  text-align: left;
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 1rem;
}

.hero-text p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons .login-btn {
  background-color: #6a0dad;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.hero-buttons .login-btn:hover {
  background-color: #5a009d;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

  </style>
  