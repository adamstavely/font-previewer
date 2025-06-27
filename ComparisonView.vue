<template>
  <div v-if="comparisonFonts.length > 0" class="comparison-view">
    <h2>Comparison View</h2>
    <div class="compare-grid">
      <div v-for="font in comparisonFonts" :key="font.name" class="compare-card" :style="{ fontFamily: font.name }">
        <h1>{{ font.name }}</h1>
        <p>{{ sampleText }}</p>
        <button>Button</button>
        <input placeholder="Input field" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['comparisonFonts', 'sampleText'])
</script>