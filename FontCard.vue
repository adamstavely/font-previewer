<template>
  <div :class="['font-card', selected ? 'selected' : '']"
       :style="{
         fontFamily: font.name,
         fontSize: fontSize + 'px',
         fontWeight,
         lineHeight,
         letterSpacing: letterSpacing + 'px',
         color: textColor,
         backgroundColor: bgColor
       }">
    <div class="font-label">
      <span>{{ font.name }}</span>
      <div class="actions">
        <button @click="copyFont(font)">Copy</button>
        <a :href="font.url" :download="getCustomFilename(font)">
          <button>Download</button>
        </a>
        <button @click="toggleFavorite(font)">⭐</button>
        <button @click="toggleCompare(font)">Compare</button>
      </div>
    </div>
    <div class="font-preview">{{ sampleText }}</div>
    <div class="ui-preview">
      <h1>Heading 1</h1>
      <p>Paragraph preview text.</p>
      <button>Button</button>
      <input placeholder="Input field" />
    </div>
    <div class="tooltip">
      Supports: {{ font.supports.join(', ') }} | Weights: {{ font.weights.join(', ') }}<br />
      Contrast: {{ getContrastLevel(textColor, bgColor) }}
    </div>
    <div v-if="font.pairsWellWith?.length" class="pairing">
      Pairs well with: {{ font.pairsWellWith.join(', ') }}
    </div>
  </div>
</template>

<script setup>
defineProps([
  'font', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textColor', 'bgColor', 'sampleText', 'selected',
  'copyFont', 'getCustomFilename', 'toggleFavorite', 'toggleCompare', 'getContrastLevel'
])
</script>