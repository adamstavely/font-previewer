<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <span class="material-symbols-outlined text-indigo-600">text_fields</span>
              Font Previewer
            </h1>
            <p class="mt-2 text-gray-600">
              Making the web more beautiful, fast, and open through great typography
            </p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{{ filteredFonts.length }} families</span>
            <button 
              v-if="favorites.length > 0 || comparisonFonts.length > 0" 
              @click="showExportModal = true" 
              class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span class="material-symbols-outlined text-lg">download</span>
              Export ({{ favorites.length + comparisonFonts.length }})
            </button>
          </div>
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
      :toggleCompare="toggleCompare"
    />

    <!-- Font Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="search || selectedTag || selectedScript || selectedWeight" class="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Search Results</h2>
        <p class="text-gray-600 mb-4">{{ filteredFonts.length }} font families found</p>
        <div v-if="search || selectedTag || selectedScript || selectedWeight" class="flex flex-wrap items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Active filters:</span>
          <span v-if="search" class="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg">Search: "{{ search }}"</span>
          <span v-if="selectedTag" class="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg">Category: {{ selectedTag }}</span>
          <span v-if="selectedScript" class="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg">Script: {{ selectedScript }}</span>
          <span v-if="selectedWeight" class="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-lg">Weight: {{ selectedWeight }}</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          :isInComparison="isInComparison(font)"
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
    <div v-if="showExportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" @click="showExportModal = false">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative" @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">Export Fonts</h3>
          <button @click="showExportModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>
        
        <div class="p-6">
          <div v-if="favorites.length > 0" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Favorites ({{ favorites.length }})</h4>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="font in favorites" :key="font.name" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg">{{ font.name }}</span>
            </div>
            <button @click="exportFavorites" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <span class="material-symbols-outlined">download</span>
              Export Favorites
            </button>
          </div>
          
          <div v-if="comparisonFonts.length > 0">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Comparison ({{ comparisonFonts.length }})</h4>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="font in comparisonFonts" :key="font.name" class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg">{{ font.name }}</span>
            </div>
            <button @click="exportComparison" class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <span class="material-symbols-outlined">compare</span>
              Export Comparison
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Preview Modal -->
    <div v-if="showQuickPreview && previewFont" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" @click="showQuickPreview = false">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-900">{{ previewFont.name }}</h3>
          <button @click="showQuickPreview = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <span class="material-symbols-outlined text-gray-600">close</span>
          </button>
        </div>
        
        <div class="p-6">
          <div class="mb-6 space-y-4">
            <div v-for="weight in (previewFont.weights || ['400'])" :key="weight" class="p-4 bg-gray-50 rounded-lg border border-gray-200" :style="{ fontFamily: `'${previewFont.name}', sans-serif`, fontWeight: weight }">
              <div class="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{{ getWeightName(weight) }} ({{ weight }})</div>
              <div class="text-lg text-gray-900 leading-relaxed">The quick brown fox jumps over the lazy dog.</div>
            </div>
          </div>
          
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button @click="toggleFavorite(previewFont)" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': isFavorite(previewFont) }">
              <span class="material-symbols-outlined">{{ isFavorite(previewFont) ? 'favorite' : 'favorite_border' }}</span>
              {{ isFavorite(previewFont) ? 'Remove from Favorites' : 'Add to Favorites' }}
            </button>
            <button @click="toggleCompare(previewFont)" class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': isInComparison(previewFont) }">
              <span class="material-symbols-outlined">{{ isInComparison(previewFont) ? 'remove_circle' : 'compare' }}</span>
              {{ isInComparison(previewFont) ? 'Remove from Comparison' : 'Add to Comparison' }}
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

function isInComparison(font) {
  return compareList.value.includes(font.name)
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