<template>
  <div :class="['font-previewer', theme, { mobileMode }]">
    <!-- Google Fonts-style Header -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">Font Previewer</h1>
          <p class="tagline">Making the web more beautiful, fast, and open through great typography</p>
        </div>
        <div class="header-stats">
          <span class="font-count">{{ filteredFonts.length }} families</span>
          <button v-if="favorites.length > 0 || comparisonFonts.length > 0" @click="showExportModal = true" class="export-btn-header">
            <span class="material-symbols-outlined">download</span>
            Export ({{ favorites.length + comparisonFonts.length }})
          </button>
        </div>
      </div>
    </header>

    <!-- Controls -->
    <FontControls
      v-model:search="search"
      v-model:selectedTag="selectedTag"
      v-model:selectedScript="selectedScript"
      v-model:selectedWeight="selectedWeight"
      v-model:sampleText="sampleText"
      v-model:fontSize="fontSize"
      v-model:fontWeight="fontWeight"
      v-model:lineHeight="lineHeight"
      v-model:letterSpacing="letterSpacing"
      v-model:textColor="textColor"
      v-model:bgColor="bgColor"
      v-model:fontTokens="fontTokens"
      :styleJSON="styleJSON"
      :favorites="favorites"
      :comparisonFonts="comparisonFonts"
      :exportStyleDictionary="exportStyleDictionary"
    />

    <!-- Comparison View -->
    <ComparisonView
      v-if="comparisonFonts.length > 0"
      :comparisonFonts="comparisonFonts"
      :sampleText="sampleText"
    />

    <!-- Font Grid -->
    <main class="main-content">
      <div class="results-header" v-if="search || selectedTag || selectedScript || selectedWeight">
        <h2>Search Results</h2>
        <p>{{ filteredFonts.length }} font families found</p>
        <div class="active-filters" v-if="search || selectedTag || selectedScript || selectedWeight">
          <span class="filter-label">Active filters:</span>
          <span v-if="search" class="filter-tag">Search: "{{ search }}"</span>
          <span v-if="selectedTag" class="filter-tag">Category: {{ selectedTag }}</span>
          <span v-if="selectedScript" class="filter-tag">Script: {{ selectedScript }}</span>
          <span v-if="selectedWeight" class="filter-tag">Weight: {{ selectedWeight }}</span>
        </div>
      </div>
      
      
      <div class="font-grid">
        <FontCard
          v-for="font in filteredFonts"
          :key="font.name"
          :font="font"
          :fontSize="fontSize"
          :fontWeight="fontWeight"
          :lineHeight="lineHeight"
          :letterSpacing="letterSpacing"
          :textColor="textColor"
          :bgColor="bgColor"
          :sampleText="sampleText"
          :selected="isFavorite(font)"
          :copyFont="copyFont"
          :getCustomFilename="getCustomFilename"
          :toggleFavorite="toggleFavorite"
          :toggleCompare="toggleCompare"
          :getContrastLevel="getContrastLevel"
          @togglePreview="quickPreview"
        />
      </div>
    </main>

    <!-- Simple Export Modal -->
    <div v-if="showExportModal" class="modal-overlay" @click="showExportModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Export Fonts</h3>
          <button @click="showExportModal = false" class="close-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div v-if="favorites.length > 0" class="export-group">
            <h4>Favorites ({{ favorites.length }})</h4>
            <div class="font-list">
              <span v-for="font in favorites" :key="font.name" class="font-item">{{ font.name }}</span>
            </div>
            <button @click="exportFavorites" class="export-btn">
              <span class="material-symbols-outlined">download</span>
              Export Favorites
            </button>
          </div>
          
          <div v-if="comparisonFonts.length > 0" class="export-group">
            <h4>Comparison ({{ comparisonFonts.length }})</h4>
            <div class="font-list">
              <span v-for="font in comparisonFonts" :key="font.name" class="font-item">{{ font.name }}</span>
            </div>
            <button @click="exportComparison" class="export-btn">
              <span class="material-symbols-outlined">compare</span>
              Export Comparison
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Preview Modal -->
    <div v-if="showQuickPreview && previewFont" class="modal-overlay" @click="showQuickPreview = false">
      <div class="preview-modal" @click.stop>
        <div class="preview-header">
          <h3>{{ previewFont.name }}</h3>
          <button @click="showQuickPreview = false" class="close-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div class="preview-body">
          <div class="preview-weights">
            <div v-for="weight in (previewFont.weights || ['400'])" :key="weight" class="weight-preview" :style="{ fontFamily: previewFont.name, fontWeight: weight }">
              <div class="weight-label">{{ getWeightName(weight) }} ({{ weight }})</div>
              <div class="weight-text">The quick brown fox jumps over the lazy dog.</div>
            </div>
          </div>
          
          <div class="preview-actions">
            <button @click="toggleFavorite(previewFont)" class="action-btn" :class="{ active: isFavorite(previewFont) }">
              <span class="material-symbols-outlined">{{ isFavorite(previewFont) ? 'favorite' : 'favorite_border' }}</span>
              {{ isFavorite(previewFont) ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
            <button @click="toggleCompare(previewFont)" class="action-btn">
              <span class="material-symbols-outlined">compare</span>
              Add to Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import FontControls from './FontControls.vue'
import FontCard from './FontCard.vue'
import ComparisonView from './ComparisonView.vue'
import { loadFont } from './useFontLoader'

import fontData from '../assets/fonts.json'

const search = ref('')
const selectedTag = ref('')
const selectedScript = ref('')
const selectedWeight = ref('')
const sampleText = ref('The quick brown fox jumps over the lazy dog.')
const showExportModal = ref(false)
const showQuickPreview = ref(false)
const previewFont = ref(null)
const fontSize = ref(24)
const fontWeight = ref(400)
const lineHeight = ref(1.4)
const letterSpacing = ref(0)
const textColor = ref('#000000')
const bgColor = ref('#FFFFFF')
const theme = ref('light')
const mobileMode = ref(false)
const favorites = ref([])
const compareList = ref([])
const fontTokens = ref({
  heading: '',
  body: '',
  ui: ''
})
const styleJSON = ref('')

// Filter and lazy load
const filteredFonts = computed(() =>
  fontData.filter((font) => {
    return (
      (!search.value || font.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedTag.value || font.tags.includes(selectedTag.value)) &&
      (!selectedScript.value || (font.supports && font.supports.includes(selectedScript.value))) &&
      (!selectedWeight.value || (font.weights && font.weights.includes(selectedWeight.value)))
    )
  })
)

const comparisonFonts = computed(() =>
  fontData.filter((f) => compareList.value.includes(f.name))
)


function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function toggleFavorite(font) {
  const index = favorites.value.indexOf(font.name)
  if (index === -1) favorites.value.push(font.name)
  else favorites.value.splice(index, 1)
}

function isFavorite(font) {
  return favorites.value.includes(font.name)
}

function toggleCompare(font) {
  const index = compareList.value.indexOf(font.name)
  if (index === -1 && compareList.value.length < 3) compareList.value.push(font.name)
  else compareList.value.splice(index, 1)
}

function copyFont(font) {
  navigator.clipboard.writeText(font.url)
}

function getCustomFilename(font) {
  return font.name.toLowerCase().replace(/\s+/g, '-') + '.woff2'
}

function getContrastLevel(textColor, bgColor) {
  // Basic WCAG contrast checker using luminance
  function luminance(hex) {
    let rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255)
    rgb = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4))
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }
  const L1 = luminance(textColor)
  const L2 = luminance(bgColor)
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'Fail'
}

function exportFavorites() {
  const output = {
    fonts: favorites.value.map(font => ({
      name: font.name,
      url: font.url,
      tags: font.tags
    }))
  }
  const json = JSON.stringify(output, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'favorite-fonts.json'
  a.click()
  URL.revokeObjectURL(url)
  showExportModal.value = false
}

function exportComparison() {
  const output = {
    fonts: comparisonFonts.value.map(font => ({
      name: font.name,
      url: font.url,
      tags: font.tags
    }))
  }
  const json = JSON.stringify(output, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'comparison-fonts.json'
  a.click()
  URL.revokeObjectURL(url)
  showExportModal.value = false
}

function quickPreview(font) {
  // Show a quick preview modal with the font in different weights
  showQuickPreview.value = true
  previewFont.value = font
}

function getWeightName(weight) {
  const weightNames = {
    '100': 'Thin',
    '200': 'Extra Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi Bold',
    '700': 'Bold',
    '800': 'Extra Bold',
    '900': 'Black'
  }
  return weightNames[weight.toString()] || 'Unknown'
}


watchEffect(() => {
  filteredFonts.value.forEach(font => {
    loadFont(font.name, font.url)
  })
})
</script>