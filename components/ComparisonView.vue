<template>
  <div v-if="comparisonFonts.length > 0" class="comparison-view">
    <div class="comparison-header">
      <h2>Font Comparison</h2>
      <p>{{ comparisonFonts.length }} fonts selected for comparison</p>
    </div>
    <div class="compare-grid">
      <div v-for="font in comparisonFonts" :key="font.name" class="compare-card" :style="{ fontFamily: font.name }">
        <div class="compare-header">
          <h3>{{ font.name }}</h3>
          <span class="font-category">{{ font.tags[0] }}</span>
        </div>
        <div class="compare-content">
          <div class="sample-text">{{ sampleText }}</div>
          <div class="ui-elements">
            <button class="sample-button">Sample Button</button>
            <input class="sample-input" placeholder="Input field" />
            <div class="sample-heading">Heading Text</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['comparisonFonts', 'sampleText'])
</script>