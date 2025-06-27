<template>
  <div class="controls">
    <input type="text" v-model="search" placeholder="Search fonts..." />
    <select v-model="selectedTag">
      <option value="">All Categories</option>
      <option value="serif">Serif</option>
      <option value="sans-serif">Sans-serif</option>
      <option value="display">Display</option>
      <option value="monospace">Monospace</option>
    </select>
    <input type="text" v-model="sampleText" placeholder="Sample text..." />
    <label>Font Size: <input type="range" v-model="fontSize" min="12" max="72" /></label>
    <label>Weight: <select v-model="fontWeight">
      <option value="400">Regular</option>
      <option value="600">Semi-Bold</option>
      <option value="700">Bold</option>
    </select></label>
    <label>Line Height: <input type="range" v-model="lineHeight" min="1" max="2" step="0.1" /></label>
    <label>Letter Spacing: <input type="range" v-model="letterSpacing" min="-2" max="5" step="0.1" /></label>
    <label>Text Color: <input type="color" v-model="textColor" /></label>
    <label>Background: <input type="color" v-model="bgColor" /></label>
    <button @click="toggleTheme">Toggle {{ theme === 'dark' ? 'Light' : 'Dark' }} Mode</button>
    <button @click="mobileMode = !mobileMode">Toggle Mobile View</button>
  </div>
</template>

<script setup>
defineProps([
  'search', 'selectedTag', 'sampleText',
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textColor', 'bgColor', 'theme', 'mobileMode', 'toggleTheme'
])
</script>