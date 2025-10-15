<template>
  <div class="font-card" :class="{ selected }">
    <!-- Font Header -->
    <div class="font-header">
      <div class="font-title">
        <h3>{{ font.name }}</h3>
        <span class="font-meta">{{ font.weights?.length || 1 }} styles</span>
      </div>
      <div class="font-actions">
        <button @click="toggleFavorite(font)" class="favorite-btn" :class="{ active: selected }" title="Add to favorites">
          <span class="material-symbols-outlined">{{ selected ? 'favorite' : 'favorite_border' }}</span>
        </button>
      </div>
    </div>

    <!-- Font Preview -->
    <div class="font-preview" :style="{ fontFamily: font.name }">
      {{ sampleText }}
    </div>

    <!-- Font Details -->
    <div class="font-details">
      <div class="font-info">
        <span class="script-support">{{ font.supports?.join(', ') || 'Latin' }}</span>
      </div>
      
      <!-- Pairing Suggestions -->
      <div v-if="font.pairsWellWith?.length" class="pairing-suggestions">
        <span class="pairing-label">Pairs with:</span>
        <div class="pairing-tags">
          <button v-for="pair in font.pairsWellWith.slice(0, 2)" :key="pair" class="pairing-tag" @click="selectPairing(pair)">
            {{ pair }}
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="card-actions">
      <button class="preview-btn" @click="togglePreview" title="Preview">
        <span class="preview-text">Aa</span>
      </button>
      <button @click="copyFont(font)" class="action-btn" title="Copy">
        <span class="material-symbols-outlined">content_copy</span>
      </button>
      <a :href="font.url" :download="getCustomFilename(font)" class="action-btn" title="Download">
        <span class="material-symbols-outlined">download</span>
      </a>
      <button @click="toggleCompare(font)" class="action-btn" title="Compare">
        <span class="material-symbols-outlined">compare</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  'font', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textColor', 'bgColor', 'sampleText', 'selected',
  'copyFont', 'getCustomFilename', 'toggleFavorite', 'toggleCompare', 'getContrastLevel'
])

const emit = defineEmits(['togglePreview', 'selectPairing', 'quickPair'])

function togglePreview() {
  emit('togglePreview', props.font)
}

function selectPairing(pairingFont) {
  emit('selectPairing', pairingFont)
}

function quickPair() {
  emit('quickPair', props.font)
}
</script>